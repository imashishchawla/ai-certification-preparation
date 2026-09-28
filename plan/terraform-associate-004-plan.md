# Final Implementation Plan: Multi-Certification Platform and Terraform Associate (004)

> **Status:** Finalized for implementation  
> **Primary public host:** GitHub Pages  
> **Agent control plane:** Cloudflare Workers  
> **Operational state store:** Cloudflare R2, restricted to compact and important operational data  
> **Automation schedule:** Category A Sunday 00:00 and Category B Monday 00:00 Asia/Kolkata  
> **Question policy:** Source-backed questions only; the platform will not generate questions  
> **New-certification policy:** A person registers and activates a certification once. Recurring updates are automated thereafter.

---

## Revision Comments — 2026-09-28

<!-- CHANGED 2026-09-28: This section records the decisions that replaced earlier assumptions so implementers can distinguish current requirements from superseded ideas. -->

| Area | Previous assumption/current repository behavior | Final value | Implementation comment |
|---|---|---|---|
| Public hosting | Two workflows can publish Pages | GitHub Pages through `deploy.yml` only | The curator updates GitHub; the deployment workflow is the sole publisher |
| Worker schedule | Current Worker uses Monday 03:00 UTC | Category A: Sunday 00:00 IST; Category B: Monday 00:00 IST | Use two schedule-category triggers and dispatch only the exams assigned to the due category |
| Exam execution | CCA-F-only workflow | Category-filtered matrix of active exams | Each exam has a schedule category, configurable runtime, and source limit |
| R2 usage | Potential document/raw-content storage | Important operational JSON only | Never store questions, documents, PDFs, the website, or secrets in R2 |
| Questions | Optional AI creation/enrichment | Source-backed extraction only | Remove Gemini/question-generation requirements and never invent questions, answers, distractors, or explanations |
| Source definitions | CCA-F-only JSON plus separately maintained Markdown | One multi-exam JSON registry | Generate the readable source report from the JSON registry |
| Browser data | Manually duplicated under `data/` and `static/data/` | Canonical GitHub data plus build-generated `public/` artifacts | Prevent stale question files from overwriting a newer Pages release |
| Cloudflare dispatch | Worker emits an event the workflow does not consume | Authenticated `certification-curation` dispatch | Validate the GitHub API response before reporting success |
| Duplicate-run prevention | R2 lock treated as the only lock | GitHub concurrency is authoritative; R2 is the run ledger | Avoid relying on object storage as an atomic locking system |

### New platform values

<!-- ADDED 2026-09-28: These are concrete implementation defaults. They remain configuration, not hardcoded application constants. -->

```toml
[automation]
timezone = "Asia/Kolkata"
dispatch_event = "certification-curation"
max_parallel_exams = 2
default_source_timeout_seconds = 30
question_generation_enabled = false
deployment_target = "github-pages"
pages_base_url = "https://imashishchawla.github.io/ai-certification-preparation/"

[automation.schedule_categories.category-a]
local_start = "Sunday 00:00"
cron_utc = "30 18 * * 6"

[automation.schedule_categories.category-b]
local_start = "Monday 00:00"
cron_utc = "30 18 * * 0"

[artifacts]
question_shard_size = 250
generate_public_manifests = true
track_public_artifacts_in_git = false

[r2]
enabled = true
store_questions = false
store_documents = false
store_raw_sources = false
store_secrets = false
run_summary_retention_days = 90
quarantine_reason_retention_days = 90
schedule_ledger_retention_days = 35
```

These values must be represented in validated configuration and read by the Worker, curator, and workflows. They must not be copied into multiple hardcoded implementations.

---

## 1. Objective

Add **HashiCorp Certified: Terraform Associate (004)** as the first new exam delivered through a reusable, exam-agnostic certification pipeline.

The resulting platform must support additional certifications without rebuilding the application for every exam. Each active exam will have categorized questions, documentation, study guides, notes, resources, and mock exams driven by shared schemas and a single source registry.

The final validated site will continue to be built and published through GitHub Actions to GitHub Pages. Cloudflare Workers will schedule and coordinate the automation. Cloudflare R2 will store only small, important operational state and recovery metadata—not question banks or documents.

---

## 2. Final Architecture Decisions

### 2.1 GitHub Pages remains the only public website publisher

GitHub will contain the canonical, validated public content:

- Exam catalog and objectives.
- Normalized source-backed questions.
- Study guides, notes, resources, and permitted documents.
- Hugo templates and browser applications.
- Source registry and validation schemas.
- Release history through Git commits.

GitHub Actions will:

1. Resolve the due schedule category and load only its active exams.
2. Fetch and validate registered sources in bounded per-exam matrix jobs.
3. Upload validated exam-update artifacts without committing from matrix jobs.
4. Merge successful exam artifacts in one promotion job while retaining previous data for failed exams.
5. Create at most one canonical commit and capture its exact SHA.
6. Call `deploy.yml` with that SHA.
7. Generate browser artifacts, build Hugo, and run deployment checks against the exact SHA.
8. Upload `public/` through `actions/deploy-pages` and verify the public release.

Public URL:

```text
https://imashishchawla.github.io/ai-certification-preparation/
```

### 2.2 Cloudflare Workers is the agent control plane

The Worker will remain lightweight. It will coordinate work but will not run document parsing, large database processing, Hugo builds, or long-running validation.

Worker responsibilities:

- Run the configured Category A and Category B schedules.
- Dispatch the GitHub curation workflow.
- Accept authenticated manual curation requests.
- Report exam, source, run, and live-release status.
- Prevent duplicate scheduled runs.
- Request rollback or republish operations through GitHub Actions.

GitHub Actions will perform the resource-intensive work.

### 2.3 R2 stores only important operational information

R2 will **not** store:

- Questions or question-bank shards.
- Study guides or documentation.
- PDFs or scraped source documents.
- The Hugo website.
- GitHub, Cloudflare, Terraform, or source credentials.

R2 will store compact JSON records only:

```text
certification-control/
├── releases/
│   ├── live.json
│   └── last-known-good.json
├── exams/
│   └── <exam-id>/status.json
├── sources/
│   └── <exam-id>/<source-id>.json
├── runs/
│   └── <exam-id>/<run-id>-summary.json
├── quarantine/
│   └── <exam-id>/<record-id>-reason.json
└── ledgers/
    ├── categories/<category-id>/<yyyy-week>.json
    └── exams/<exam-id>/<yyyy-week>.json
```

These objects contain only:

- Release ID and Git commit SHA.
- Last-known-good release pointer.
- Source URL hash, ETag, Last-Modified value, and last successful check.
- Counts of accepted, rejected, unchanged, and quarantined records.
- Validation summary and failure reasons.
- Run start, finish, and duration.
- Weekly run-ledger records used with GitHub Actions concurrency for idempotency.

Retention policy:

- Keep the live and last-known-good pointers indefinitely.
- Keep the latest source status per source.
- Keep weekly run summaries for 90 days.
- Keep quarantine reasons for 90 days after resolution.
- Do not store the rejected source body in R2.

The canonical recovery mechanism remains Git history and GitHub Pages releases.

### 2.4 Questions are never generated

The automation will only accept questions found in approved sources.

Permitted operations:

- Extract a source question.
- Preserve its original meaning.
- Normalize formatting and option identifiers.
- Categorize it by exam, domain, and objective.
- Preserve a source-provided explanation.
- Attach provenance and source metadata.
- Reject duplicates, incomplete items, or unverified answers.

Prohibited operations:

- Invent a new question.
- Ask an AI service to generate question variants.
- Invent distractors or answers.
- Create an explanation not supported by the source.
- Publish content from an unregistered, inactive, blocked, or reference-only source.

If a source has no usable explanation, the record may remain practice-only with a clear source reference, or it must be excluded according to the exam's publication rules.

---

## 3. Existing Flow and Required Corrections

### 3.1 Existing GitHub Pages flow to retain

```text
Push to main
    |
    v
.github/workflows/deploy.yml
    |
    v
Hugo build using the GitHub Pages base URL
    |
    v
Upload public/ Pages artifact
    |
    v
actions/deploy-pages
    |
    v
GitHub Pages production website
```

### 3.2 Cloudflare dispatch is currently incomplete

The Worker sends a GitHub `repository_dispatch` event, but the current weekly workflow does not listen for `repository_dispatch`. The workflow must add:

```yaml
on:
  repository_dispatch:
    types: [certification-curation]
  schedule:
    - cron: "30 18 * * 6" # Category A: Sunday 00:00 Asia/Kolkata
    - cron: "30 18 * * 0" # Category B: Monday 00:00 Asia/Kolkata
  workflow_dispatch:
```

The Worker must send:

```json
{
  "event_type": "certification-curation",
  "client_payload": {
    "scheduleCategory": "category-a-or-category-b",
    "exam": "active-in-category",
    "triggeredBy": "cloudflare-cron"
  }
}
```

The current `/api/v1/curate` response only reports success. It must authenticate the caller, dispatch the workflow, check GitHub's response, and return the actual GitHub run request result.

### 3.3 Only one workflow may deploy Pages

Responsibilities will be separated:

```text
curate-certifications.yml
├── Resolve the due schedule category
├── Run per-exam fetch and validation matrix jobs
├── Upload per-exam candidate artifacts; matrix jobs never push
├── Merge successful artifacts in one promotion job
├── Create at most one commit and capture release_sha
└── Call deploy.yml through workflow_call with release_sha

deploy.yml
├── Accept release_sha through workflow_call or workflow_dispatch
├── Check out the exact release_sha
├── Validate every active exam using its current canonical data
├── Generate browser artifacts
├── Build and test Hugo
├── Deploy to GitHub Pages
└── Verify that the public release reports release_sha
```

The curation workflow will no longer deploy Pages directly. It invokes `deploy.yml` as the reusable, single production publisher. The deployment must not depend on a push made by `GITHUB_TOKEN`; it receives and checks out the promoted commit through the explicit `release_sha` input.

<!-- CHANGE COMMENT (2026-09-28): Matrix jobs now publish temporary artifacts only. A single promotion job prevents concurrent Git pushes, and the reusable deployment workflow receives the exact promoted SHA. -->

### 3.4 Remove the manually synchronized public question copy

`data/questions/<exam-id>/questions.json` will be canonical. The Pages build will generate browser-ready data into `public/data/exams/<exam-id>/`.

The pipeline will not depend on manually keeping `data/questions/` and `static/data/questions/` synchronized.

---

## 4. Scheduling and Per-Exam Time Budgets

### 4.1 Weekly schedule categories

Active exams are divided into configurable schedule categories. Only the active exams assigned to the category due at that trigger are placed into the matrix.

| Schedule category | Asia/Kolkata start | Equivalent UTC cron |
|---|---:|---:|
| Category A | Sunday 00:00 | `30 18 * * 6` |
| Category B | Monday 00:00 | `30 18 * * 0` |

<!-- CHANGE COMMENT (2026-09-28): Replaced the single Monday 05:00 run with schedule-driven exam categories so future certifications can be distributed across weekly windows without changing workflow code. -->

Cloudflare is the primary scheduler. GitHub's schedule is a fallback. GitHub Actions concurrency is the authoritative execution lock. The R2 schedule record provides an idempotency ledger so a queued duplicate can exit after observing that the exam/week run already completed.

### 4.2 Per-exam runtime configuration

Every active exam must define its own time budget:

```toml
[[exams]]
id = "cca-f"
sync_enabled = true
schedule_category = "category-a"
sync_timeout_minutes = 60
source_timeout_seconds = 30
max_sources_per_run = 25
minimum_mock_questions = 60
question_shard_size = 250

[[exams]]
id = "terraform-associate"
sync_enabled = true
schedule_category = "category-b"
sync_timeout_minutes = 45
source_timeout_seconds = 30
max_sources_per_run = 20
minimum_mock_questions = 60
question_shard_size = 250
practice_pass_percent = 70
practice_threshold_is_official = false
```

Initial budgets:

| Exam | Schedule category | Weekly start | Maximum runtime | Behavior at timeout |
|---|---:|---:|---:|---|
| CCA-F | Category A | Sunday 00:00 IST | 60 minutes | Stop safely; retain previous release |
| Terraform Associate | Category B | Monday 00:00 IST | 45 minutes | Stop safely; retain previous release |
| Planned/inactive exams | Not scheduled | None | None | Onboarding only |

Active exams due in the triggered schedule category run as a bounded GitHub Actions matrix. Schedule assignment and time budget are configurable without code changes when additional certifications are activated.

---

## 5. Unified Exam and Source Registries

### 5.1 Exam catalog

`data/exams.toml` remains the public exam catalog and will contain:

- Stable exam ID and code.
- Name and provider.
- Certification version.
- Status: `planned`, `onboarding`, `active`, `paused`, or `retired`.
- Public path.
- Duration and internal practice threshold.
- Supported question types.
- Objective catalog path.
- Weekly synchronization settings.
- Minimum release requirements.

### 5.2 One source list for all exams

`.agent/cert-prep-curator/sources.json` becomes the only machine-maintained source registry:

```json
{
  "version": "2.0.0",
  "exams": {
    "cca-f": {
      "sources": []
    },
    "terraform-associate": {
      "sources": []
    }
  }
}
```

Each source must declare:

- Source ID and applicable exam IDs.
- Name, URL, and allowed redirect hosts.
- Trust tier and active status.
- Source format and parser adapter.
- Applicable domains and objectives.
- Publication mode: `question-source`, `document-source`, or `reference-only`.
- Refresh frequency.
- File-size and timeout limits.
- Destination category.

`plan/sources.md` will be generated from this JSON registry. It will not be maintained as a second independent source list.

<!-- CHANGE COMMENT (2026-09-28): Registered sources now use registry membership and trust tier as the recurring automation gate. The weekly workflow does not repeat robots, terms, or license checks for sources already approved in the registry. -->

Candidate URL handling:

1. Normalize the discovered URL and host.
2. Match it against an active `baseUrl` or `endpoints` entry in `.agent/cert-prep-curator/sources.json`.
3. Use `plan/sources.md` only as the generated human-readable view for review and reporting.
4. Read the registered trust tier and publication mode.
5. Continue automatically for active Tier 1 or Tier 2 sources whose publication mode permits the requested ingestion.
6. Do not fetch or publish an unregistered, inactive, blocked, or candidate-only source. Record its URL as a discovery candidate for a future onboarding change.

Trust levels:

- `tier-1-official`: official certification or product source; automatic processing allowed when active.
- `tier-2-verified` or `tier-2-curated`: previously reviewed source; automatic processing allowed when active.
- `tier-3-candidate`: discovery only; never publish automatically.
- `blocked`: never fetch or publish.

---

## 6. Question and Content Model

### 6.1 Question schema

The shared schema supports the official formats used by Terraform Associate:

```json
{
  "id": "terraform-associate-source-001",
  "exam": "terraform-associate",
  "examVersion": "004",
  "domain": "D4 Terraform Configuration",
  "objective": "4g",
  "questionType": "multiple_choice",
  "prompt": "Source-provided question text",
  "options": [
    { "id": "A", "text": "Option A" },
    { "id": "B", "text": "Option B" }
  ],
  "correct": ["A"],
  "minSelections": 1,
  "maxSelections": 1,
  "explanation": "Source-provided explanation",
  "sourceId": "registered-source-id",
  "sourceLocator": "page or item locator",
  "sourceHash": "sha256",
  "status": "ready",
  "mockEligible": true
}
```

Supported types:

- `true_false`
- `single_choice`
- `multiple_choice`

Existing CCA-F scalar answers will be read through a backward-compatible adapter and migrated only when safe.

### 6.2 Required categorization

Every question is categorized by:

- Certification and certification version.
- Domain and official objective.
- Question type.
- Difficulty when supplied or reliably classified from the source.
- Source and source locator.
- Publication and validation status.
- Mock-exam eligibility.

Every document is categorized into:

- Exam overview.
- Official objectives.
- Study guides.
- Study materials.
- Practice questions.
- Mock exams.
- Exam notes.
- Labs and exercises.
- Resources and cheat sheets.
- Glossary.
- Source/update history.

---

## 7. Terraform Associate (004) Content Package

### 7.1 Verified exam baseline

- Certification: HashiCorp Certified: Terraform Associate (004).
- Terraform version tested: 1.12.
- Duration: one hour.
- Question formats: true/false, single-answer, and multiple-answer.
- Eight official objective domains.

HashiCorp does not publish official domain percentages or a public passing-score formula. The site must not present internal mock allocations or practice thresholds as official facts.

### 7.2 Official domain structure

| Domain | Name | Primary objective coverage |
|---|---|---|
| D1 | Infrastructure as Code with Terraform | IaC concepts, benefits, multi-cloud, hybrid-cloud, service-agnostic workflows |
| D2 | Terraform Fundamentals | Providers, versions, multiple providers, state purpose |
| D3 | Core Terraform Workflow | `init`, `validate`, `plan`, `apply`, `destroy`, `fmt`, dependency graph |
| D4 | Terraform Configuration | Resources, data sources, references, variables, outputs, complex types, expressions, lifecycle, custom conditions, sensitive data |
| D5 | Terraform Modules | Sources, scope, composition, Registry use, module versions |
| D6 | Terraform State Management | Local backend, locking, remote state, drift, refresh-only, moved and removed blocks |
| D7 | Maintain Infrastructure | Import, state inspection, verbose logging |
| D8 | HCP Terraform | Workspaces, projects, workflows, collaboration, governance, and integrations |

### 7.3 Target content structure

```text
content/exams/terraform-associate/
├── _index.md
├── sample-questions/
│   └── _index.md
├── mock-test/
│   └── _index.md
├── study-guides/
│   ├── _index.md
│   ├── 01-iac-fundamentals.md
│   ├── 02-terraform-fundamentals.md
│   ├── 03-core-workflow.md
│   ├── 04-terraform-configuration.md
│   ├── 05-modules.md
│   ├── 06-state-management.md
│   ├── 07-maintain-infrastructure.md
│   └── 08-hcp-terraform.md
├── exam-notes/
│   ├── _index.md
│   └── 004-exam-differences.md
├── study-materials/
│   └── _index.md
├── resources/
│   ├── _index.md
│   └── terraform-cli-cheatsheet.md
├── labs/
│   └── _index.md
└── glossary/
    └── _index.md

data/
├── objectives/
│   └── terraform-associate.json
└── questions/
    └── terraform-associate/
        └── questions.json
```

### 7.4 Source policy

Initial source categories:

- HashiCorp certification page.
- Official Terraform Associate 004 content list.
- Official learning path.
- Official sample-question page.
- Terraform CLI and configuration-language documentation.
- State, module, and HCP Terraform documentation.
- Community question banks registered as active Tier 2 `question-source` entries.

The pipeline may extract questions only from entries registered as question sources. General documentation must not be transformed into newly generated questions.

---

## 8. Automated Curation Pipeline

For every scheduled category run:

1. Resolve the due category from the Worker payload, GitHub cron value, or validated manual input.
2. Load `data/exams.toml` and select only exams that are active, synchronization-enabled, and assigned to that category.
3. Enter the category/week GitHub concurrency group and check the compact R2 idempotency ledger.
4. Run one bounded matrix job for each selected exam.
5. Load the exam configuration, time budget, and registered source entries.
6. Match discovered URLs against `.agent/cert-prep-curator/sources.json`; treat `plan/sources.md` as its generated readable view.
7. Record an unregistered URL as a discovery candidate only. Do not fetch or publish it.
8. For an active Tier 1 or Tier 2 source, apply its registered publication mode.
9. Use ETag, Last-Modified, and source hashes to fetch only new or changed allowed content.
10. Validate URL match, redirects, MIME type, size, timeout, and content hash.
11. Parse through the registered adapter and extract only content present in the source.
12. Normalize without changing meaning, categorize, deduplicate, and validate provenance and answer integrity.
13. On failure, upload a compact failed-exam result and retain that exam's previous canonical content.
14. On success, upload a validated per-exam update artifact; the matrix job must not commit or push.
15. In one promotion job, merge successful exam artifacts with unchanged canonical data for failed or skipped exams.
16. Run cross-exam canonical validation and create at most one commit on `main`.
17. Capture the promoted commit as `release_sha`; if nothing changed, reuse the current canonical SHA.
18. Call the reusable `deploy.yml` with `release_sha`.
19. Check out the exact SHA, generate browser artifacts, validate all active canonical exams, build Hugo, and run link/browser/regression tests.
20. Deploy GitHub Pages only when every deployment gate passes.
21. Verify the public release reports the expected SHA, then write compact run and release status to R2.

No question-generation API or model is part of this flow.

---

## 9. Validation and Publication Gates

### 9.1 Source gates

- Source exists in the master registry.
- Candidate URL matches the registered base URL, endpoint, and allowed redirect hosts.
- Source is active and its trust tier permits automatic processing.
- Publication mode permits question or document ingestion for the requested destination.
- Content type and size match the registry.
- Source hash and locator are recorded.
- Robots, terms, and license checks are not repeated during weekly processing for registered sources.

### 9.2 Question gates

- Question text, answer, and options were present in the source.
- Exam, domain, and objective are valid.
- Question type and selection limits are valid.
- Every correct answer exists in the option list.
- IDs are unique.
- No answer marker leaks into the prompt or options.
- Duplicate threshold checks pass.
- Source ID, locator, and hash are present.
- Mock-eligible questions meet the exam's stricter rules.

### 9.3 Document gates

- Document category is valid.
- The registered source publication mode permits document ingestion.
- Internal links and assets resolve.
- No external script, form, tracker, or executable content is introduced.
- File-size limits keep the GitHub repository and Pages artifact controlled.

### 9.4 Release gates

- Every active exam's current canonical data validates successfully; a failed scheduled update retains that exam's previously valid data.
- Minimum question and objective coverage is satisfied.
- Browser artifacts match canonical counts and hashes.
- Hugo builds using the production GitHub Pages base URL.
- Internal-link, rendered-page, and browser tests pass.
- Existing CCA-F behavior passes regression tests.
- Terraform practice and mock pages support all three question types.

A failed per-exam candidate update retains that exam's previously valid canonical data and does not block unrelated successful exam artifacts from reaching the promotion check. If the combined promotion or deployment gates fail, no new Pages release is published and the previous release remains live.

---

## 10. Skills and MCP Decision

### Reuse

- Generalize the existing `.agent/cert-prep-curator/` CLI.
- Reuse the existing Cloudflare Worker as the control-plane foundation.
- Reuse GitHub Actions and the existing Hugo/GitHub Pages deployment.

### Create

Create a repository-local `certification-curator` skill for:

- Adding a new certification.
- Registering objectives and sources.
- Selecting or adding a source adapter.
- Setting the weekly time budget.
- Running onboarding validation.
- Diagnosing quarantined records.
- Requesting rollback or republish operations.

### Optional Terraform MCP

The official Terraform MCP server may be used during development to retrieve current Registry, provider, module, or policy documentation. It is not required by the production pipeline and is not a question source by itself.

### Do not create a custom MCP server now

The generic CLI, GitHub Actions, and authenticated Worker API cover the required automation. A custom MCP server would add maintenance without improving the current publication flow.

---

## 11. GitHub and Cloudflare Workflow

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

## 12. Implementation Phases

### Phase 1: Contracts and regression baseline

- Add exam, source, question, release, and audit schemas.
- Capture passing CCA-F validation and browser behavior.
- Correct Terraform exam facts and objective mappings.

### Phase 2: Generic catalog and source registry

- Upgrade the source registry to its multi-exam schema.
- Update every source-registry consumer.
- Add dynamic exam scheduling and time budgets.

### Phase 3: Generic question and site engines

- Support true/false, single-answer, and multiple-answer records.
- Replace hardcoded CCA-F template and JavaScript values.
- Consolidate duplicate layouts and JavaScript copies.
- Generate public artifacts from canonical data during the build.

### Phase 4: Cloudflare control plane and minimal R2 state

- Secure the Worker endpoints.
- Implement real GitHub dispatch.
- Add R2 bindings, locks, status, source fingerprints, and release pointers.
- Remove hardcoded Worker exam counts and domains.

### Phase 5: GitHub workflow separation

- Make matrix jobs upload per-exam artifacts without committing.
- Add one promotion job that creates at most one canonical commit.
- Make `deploy.yml` the sole Pages publisher.
- Pass the exact promoted `release_sha` to `deploy.yml` through `workflow_call`.
- Add the Category A Sunday 00:00 and Category B Monday 00:00 triggers and fallback schedules.
- Add per-exam timeouts and matrix execution.

### Phase 6: Terraform Associate content

- Register the exam and objectives.
- Register approved sources.
- Create the categorized page structure.
- Ingest and validate source-backed questions and documents.
- Require sufficient validated inventory before activation.

### Phase 7: End-to-end release verification

- Run schema, source, question, Hugo, rendered-link, and browser checks.
- Verify CCA-F regression behavior.
- Verify the Terraform practice and mock experience.
- Verify GitHub Pages deployment and Worker/R2 status reporting.

---

## 13. Estimated Repository Impact

Implementation forecast:

| Change | Estimated files |
|---|---:|
| Created | 51 |
| Modified | 34 |
| Deleted or replaced | 7 |
| Total source-controlled changes | 92 |

Initial ignored build artifacts:

- Seven CCA-F browser artifacts: manifest, mock index, and five domain shards.
- Ten Terraform browser artifacts: manifest, mock index, and eight domain shards.
- Additional numbered shards will be generated only when a domain exceeds its configured shard size.

The count excludes temporary fetched source files because they exist only in the GitHub Actions workspace and are discarded after processing.

---

## 14. New-Certification Onboarding

Adding another certification requires one bounded onboarding change:

1. Add the exam catalog entry.
2. Add the official objective catalog.
3. Register approved sources with trust tiers, active status, and publication modes.
4. Select existing adapters or implement a source-specific adapter.
5. Assign a schedule category and set runtime and source limits.
6. Set minimum content and question release gates.
7. Run onboarding fixtures and onboarding validation.
8. Approve activation.

After activation, weekly fetching, validation, categorization, GitHub updates, GitHub Pages publication, R2 status updates, quarantine, and recovery run without routine human intervention.

---

## 15. Final Outcome

- Terraform Associate (004) is published alongside CCA-F on GitHub Pages.
- The existing Hugo site becomes exam-agnostic.
- All exams use one catalog, one source registry, one question contract, and one deployment pipeline.
- Questions are always traceable to approved sources and are never generated.
- Documentation and questions remain in GitHub and are served by GitHub Pages.
- R2 usage remains small and limited to essential operational JSON.
- Cloudflare Workers coordinates scheduled agents and exposes accurate status APIs.
- Every active exam runs in its configured weekly schedule category with a configurable maximum runtime.
- Invalid content is quarantined automatically and cannot replace the live release.
- `deploy.yml` is the single authority for publishing GitHub Pages.
- Future certifications require initial onboarding only; recurring maintenance is automated.
