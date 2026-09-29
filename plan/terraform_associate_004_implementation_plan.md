# Terraform Associate (004) — Detailed Implementation Plan

> **Artifact status:** Verified and updated for implementation on 2026-09-28  
> **Canonical detailed plan:** `plan/terraform-associate-004-plan.md`  
> **Final publisher:** GitHub Pages  
> **Agent coordinator:** Cloudflare Workers  
> **R2 policy:** Important operational JSON only; accessed via HMAC-signed Worker proxy (no R2 keys in Actions)  
> **Question policy:** Extract from approved sources; never generate questions  
> **Timezone:** Asia/Kolkata (IST, UTC+5:30)  
> **Weekly schedules:**  
> - Category A: Primary Sun 00:00 IST (`30 18 * * 6` UTC) · Fallback Sun 00:15 IST (`45 18 * * 6` UTC)  
> - Category B: Primary Mon 00:00 IST (`30 18 * * 0` UTC) · Fallback Mon 00:15 IST (`45 18 * * 0` UTC)

---

## Verification Findings (Pre-Implementation Gaps)

The following gaps exist between the current repository state and the target plan. Every item below is accounted for in the file manifest. This section exists so implementers know exactly what is broken today and why each phase fix is required.

| # | Gap | Current state | Required state | Fixed in phase |
|---|---|---|---|---|
| G1 | `wrangler.toml` cron | `0 3 * * 1` (Mon 03:00 UTC = Mon 08:30 IST) | `30 18 * * 6` + `30 18 * * 0` (Sun/Mon 00:00 IST) | F |
| G2 | Worker dispatches wrong event | `event_type: weekly-curator-sync` | `event_type: certification-curation` + category payload | F |
| G3 | Worker has no HMAC, no R2, no category routing | None implemented | Full HMAC proxy + fail-closed routing | F |
| G4 | `weekly-curator.yml` uses Gemini AI | `extract-ai cca-f` step + `GEMINI_API_KEY` | Deleted; replaced by `curate-certifications.yml` | G |
| G5 | `deploy.yml` missing `workflow_call` trigger | Push/dispatch only, concurrency group `pages` | Dual-trigger, concurrency `github-pages-production`, preparation job | G |
| G6 | `data/exams.toml` has no Terraform entry | CCA-F, CCAR-P, CCDV-F only | Add `terraform-associate` with `status = onboarding` | A |
| G7 | `.gitignore` missing secret patterns | No `.env*` or `.dev.vars*` entries | Both patterns added before any secrets created | A (first step) |
| G8 | `sources.json` is CCA-F only (v1) | Single-exam flat format | Multi-exam v2.0.0 with namespaced exam keys | B |
| G9 | README says `MON 00:00 UTC` | Wrong timezone label | `Sun/Mon 00:00 IST` | H (final) |
| G10 | Worker `wrangler.toml` has hardcoded `EXAM_CODE`, `TOTAL_QUESTIONS` | CCA-F specific vars | Removed; Worker is exam-agnostic | F |

---

## Approved Configuration Values

```yaml
platform:
  public_host: github-pages
  pages_url: https://imashishchawla.github.io/ai-certification-preparation/
  agent_control_plane: cloudflare-workers
  canonical_database: github

automation:
  timezone: Asia/Kolkata   # IST UTC+5:30
  schedule_categories:
    category-a:
      local_start: "Sunday 00:00 IST"
      primary_cron_utc:  "30 18 * * 6"   # Sat 18:30 UTC = Sun 00:00 IST
      fallback_cron_utc: "45 18 * * 6"   # Sat 18:45 UTC = Sun 00:15 IST
    category-b:
      local_start: "Monday 00:00 IST"
      primary_cron_utc:  "30 18 * * 0"   # Sun 18:30 UTC = Mon 00:00 IST
      fallback_cron_utc: "45 18 * * 0"   # Sun 18:45 UTC = Mon 00:15 IST
  dispatch_event: certification-curation
  max_parallel_exams: 2
  default_source_timeout_seconds: 30
  question_generation_enabled: false
  deployment_concurrency_group: github-pages-production

r2:
  enabled: true
  access_mode: worker-hmac-proxy
  bucket_name: certification-control
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
  output_directory: "public/data/exams"
  initial_counts:
    cca-f: 9        # 7 domain shards (D1→3 shards, D2–D5→1 shard each) + 1 manifest + 1 mock-index
    terraform: 10   # 8 domain shards (D1–D8→1 shard each) + 1 manifest + 1 mock-index
    total: 19

exams:
  cca-f:
    status: active
    sync_enabled: true
    schedule_category: category-a
    timeout_minutes: 60
    max_sources_per_run: 25
    minimum_mock_questions: 60
  terraform-associate:
    version: "004"
    terraform_version_tested: "1.12"
    status: onboarding
    sync_enabled: true
    schedule_category: category-b
    timeout_minutes: 45
    max_sources_per_run: 20
    minimum_mock_questions: 60
    practice_pass_percent: 70
    practice_threshold_is_official: false
    scoring_policy: all_or_nothing
```

---

## Secret Key Setup (Do Before Phase A)

### Step 0-A — Fix `.gitignore` first (before touching any credentials)

Add these lines to `.gitignore` before creating any local files:

```gitignore
.env
.env.*
!.env.example
.dev.vars
.dev.vars.*
!.dev.vars.example
```

### Step 0-B — Generate `STATUS_HMAC_SECRET`

Run once; save the output — you need the **same value** in Cloudflare, GitHub, and local dev:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Example output: a3f8c2d1e9b74605f2a1c8d3b7e94f1a2c6d8e0b1f3a5c7d9e2b4f6a8c0d2e4
```

### Step 0-C — Create Cloudflare R2 bucket

```bash
cd cloudflare/cert-prep-curator-worker
npx wrangler r2 bucket create certification-control
```

### Step 0-D — Set Cloudflare Worker secrets

```bash
cd cloudflare/cert-prep-curator-worker

# Option 1 (Initial prototype): Fine-grained PAT
# Create at: GitHub → Settings → Developer settings → Fine-grained personal access tokens
# Required permission: Actions → Read and Write (for repository_dispatch only)
# Scope: Only repository "imashishchawla/ai-certification-preparation"
npx wrangler secret put GITHUB_DISPATCH_TOKEN
# Paste the PAT when prompted — it is encrypted and never visible again

# Option 2 (Production): GitHub App private key
# Create at: GitHub → Settings → Developer settings → GitHub Apps → New GitHub App
# Required permissions: Actions: Read & Write
# After creation, generate a private key (PEM file) and download it
npx wrangler secret put GITHUB_APP_PRIVATE_KEY
# Paste the full PEM content including BEGIN/END RSA PRIVATE KEY lines

# HMAC shared secret — use the value generated in Step 0-B
npx wrangler secret put STATUS_HMAC_SECRET
# Paste the hex string
```

### Step 0-E — Set GitHub repository secrets and variables

Navigate to: **GitHub repo → Settings → Secrets and variables → Actions**

**Secrets tab — New repository secret:**

| Secret name | Value |
|---|---|
| `STATUS_HMAC_SECRET` | Same hex value from Step 0-B (must match Cloudflare) |
| `FIRECRAWL_API_KEY` | Your Firecrawl API key — only if you enable Firecrawl for JS-rendered sources |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Worker:Edit permission — only if Actions deploys Worker |

**Variables tab — New repository variable:**

| Variable name | Value |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID (Dashboard → right sidebar) |
| `CURATOR_WORKER_URL` | `https://cert-prep-curator-worker.<your-subdomain>.workers.dev` (set after first Worker deploy) |

### Step 0-F — Local development `.dev.vars` and `.env`

```bash
# cloudflare/cert-prep-curator-worker/.dev.vars  (used by "wrangler dev")
GITHUB_DISPATCH_TOKEN=ghp_your_local_test_pat
STATUS_HMAC_SECRET=<same hex from Step 0-B>

# .env  (at repo root, used by Node.js scripts locally)
STATUS_HMAC_SECRET=<same hex from Step 0-B>
CURATOR_WORKER_URL=http://localhost:8787
```

### Step 0-G — Verify branch protection

In the GitHub repo: **Settings → Branches → Branch protection rules → main**

Confirm that `github-actions[bot]` or all users are allowed to push to `main` directly (no required PR reviews for bot pushes). If enterprise policy blocks all direct pushes, Phase G will use an automation branch with auto-merge instead.

---

## Component Responsibility Map

| Component | Owns | Must not own |
|---|---|---|
| **GitHub repository** | Catalog, objectives, source registry, questions, documents, code, schemas | Secrets or temporary downloads |
| **GitHub Actions curator** | Fetch, parse, normalize, categorize, deduplicate, validate, single promotion commit | Production Pages deployment or direct R2 access keys |
| **GitHub Actions deploy** | Generate browser artifacts into `public/`, build Hugo, test, publish Pages | Source ingestion |
| **GitHub Pages** | Final public site and browser-readable artifacts | Agent coordination or private operational state |
| **Cloudflare Worker** | Schedule, fail-closed dispatch, status API, HMAC verification, R2 write proxy | Large parsing jobs, Hugo builds, question storage |
| **Cloudflare R2** | Small operational JSON and recovery pointers | Questions, documents, PDFs, raw sources, website, secrets |

---

## End-to-End Execution Flow

```text
SCHEDULE TRIGGER (IST midnight)
  Category A: Sunday 00:00 IST  → Cloudflare Worker cron `30 18 * * 6` UTC (primary)
  Category B: Monday 00:00 IST  → Cloudflare Worker cron `30 18 * * 0` UTC (primary)
        │
        ├── Cloudflare Worker fires first
        │     └── Dispatches GitHub repository_dispatch: certification-curation
        │           payload: { scheduleCategory, triggeredBy: "cloudflare-worker" }
        │
        ├── GitHub fallback fires 15 min later
        │     Category A: `45 18 * * 6` UTC (Sun 00:15 IST)
        │     Category B: `45 18 * * 0` UTC (Mon 00:15 IST)
        │     └── Checks R2 ledger → if Cloudflare run recorded, exits cleanly
        │
        └── Manual dispatch: workflow_dispatch with optional scheduleCategory
                │
                ▼
curate-certifications.yml
  01  Resolve trigger and category
  02  Validate configuration and credentials
  03  Check concurrency group (category/<week>) + R2 idempotency ledger
        └── Already recorded → exit without duplicate release
  04  Build exam matrix: load data/exams.toml
        └── Select: sync_enabled = true AND status in [onboarding, active] AND category matches
  ── Matrix jobs (parallel, max 2) ─────────────────────────────────────────
  05  Fetch registered sources (ETag/hash; skip unchanged)
  06  Parse and normalize (source-present content only; no generation)
  07  Validate exam candidate (schema, options, answers, provenance, duplicates)
  08  Upload per-exam artifact (pass or structured failure)
        └── Matrix jobs NEVER commit or push
  ── End matrix ─────────────────────────────────────────────────────────────
  09  Combine and revalidate candidates (single promotion job)
        ├── Missing artifact → synthesize EXAM_JOB_MISSING_RESULT
        ├── Merge passing exam updates onto latest origin/main
        ├── Retain previous canonical data for failed/skipped exams
        └── Rerun full cross-exam validation
  10  Promote canonical data
        ├── No changes → reuse current SHA; update run status only
        ├── Validation failed → no commit; record compact failure
        └── Changes accepted → single commit via GITHUB_TOKEN; capture release_sha
              └── Push rejected → bounded retry once; if second fails → stop safely
                │
                ▼
deploy.yml (workflow_call with release_sha)
  concurrency: group: github-pages-production, cancel-in-progress: false
  ── Preparation job ──────────────────────────────────────────────────────
      Resolve and validate target release_sha
  11  Build Hugo into public/ (exact release_sha checkout; production baseURL)
  12  Generate browser shards into public/data/exams/<exam-id>/
        250 questions/shard · manifest with checksums · schema version · release_sha
        Generate public/release.json
  13  Run release tests (schema · link integrity · browser engines · regressions)
        └── Failed → do not deploy; previous Pages release remains live
  14  Deploy GitHub Pages (actions/deploy-pages; single artifact)
  15  Verify live /release.json reports expected release_sha
        └── Failed → mark unverified; keep last-known-good pointer
  16  Record final run status to R2 via Worker HMAC proxy (if: always())
        └── Write: runs/<exam-id>/<run-id>-summary.json
              releases/live.json (on success only)
              releases/last-known-good.json (on success only)
              ledgers/categories/<category>/<yyyy-week>.json
```

---

## Observability Contract

### 16 Named Workflow Stages

Every execution displays these named stages in the GitHub Actions UI:

```text
01 Resolve trigger and category
02 Validate configuration and credentials
03 Check concurrency and weekly ledger
04 Build exam matrix
05 Fetch registered sources
06 Parse and normalize source content
07 Validate exam candidate
08 Upload per-exam result
09 Combine and revalidate candidates
10 Promote canonical data
11 Build Hugo
12 Generate browser artifacts
13 Run release tests
14 Deploy GitHub Pages
15 Verify live release
16 Record final run status
```

### Matrix Job Specification

```yaml
name: "${{ matrix.exam_id }} • curate and validate"
strategy:
  fail-fast: false
  matrix:
    exam: ${{ fromJSON(needs.prepare.outputs.matrix) }}
```

### Structured Diagnostic Format

Every stage failure produces:

```json
{
  "status": "failed",
  "error_code": "SRC_FETCH_TIMEOUT",
  "stage": "05 Fetch registered sources",
  "exam_id": "terraform-associate",
  "source_id": "hashicorp-004-review",
  "message": "Endpoint exceeded 30 second timeout threshold",
  "retryable": true,
  "details": { "url": "https://developer.hashicorp.com/...", "elapsed_ms": 30045 }
}
```

### Error Families

| Prefix | Category |
|---|---|
| `AUTH_*` | Authentication, permissions, or missing token errors |
| `CONFIG_*` | Invalid exam, source, objective, or schedule configuration |
| `LEDGER_*` | R2 ledger, concurrency, or idempotency verification failures |
| `SOURCE_*` | Fetch, redirect, MIME type, size limit, or timeout failures |
| `PARSE_*` | Source adapter extraction or content structure parsing failures |
| `VALIDATION_*` | Schema, option count, answer integrity, or duplicate check failures |
| `PROMOTION_*` | Revalidation, commit creation, or push rejection failures |
| `BUILD_*` | Hugo compilation or browser artifact generation errors |
| `DEPLOY_*` | GitHub Pages upload or deployment failures |
| `VERIFY_*` | Live release SHA or `/release.json` verification failures |

Every failure also:
- Exits non-zero (never masks failures with `|| true`).
- Emits `::error title=<CODE>::[<CODE>] <exam>/<source> <detail>` to GitHub Annotations.
- Appends a formatted Markdown row to `$GITHUB_STEP_SUMMARY`.
- Uploads sanitized diagnostics JSON with `if: always()` and a 14-day retention. Never includes secrets or private payloads.

---

## Credential Topology (Security Architecture)

```
                  ┌──────────────────────────────────────────────┐
                  │              Cloudflare Worker               │
                  │  Secrets: GITHUB_DISPATCH_TOKEN (PAT/App)    │
                  │           STATUS_HMAC_SECRET                 │
                  │  Vars:    GITHUB_REPO, GITHUB_AUTH_MODE       │
                  │  Binding: CONTROL_BUCKET (R2 native)         │
                  └───────────────┬──────────────┬───────────────┘
          repository_dispatch     │              │ native R2 binding
         (PAT or App token)       │              │ (CONTROL_BUCKET)
                                  ▼              ▼
┌──────────────────────────────────────┐   ┌───────────────────────────────┐
│            GitHub Actions            │   │         Cloudflare R2         │
│  Secret: STATUS_HMAC_SECRET          │   │  Bucket: certification-control│
│  Built-in: GITHUB_TOKEN (push/commit)│   │  (operational JSON only;      │
│  Optional: FIRECRAWL_API_KEY         │   │   no questions, no secrets)   │
└──────────────────┬───────────────────┘   └───────────────────────────────┘
                   │ HMAC-signed POST /api/v1/status
                   └──────► Worker validates → writes to R2
```

**Key invariants:**
- GitHub Actions never holds R2 access keys or secret IDs.
- The promotion commit uses the built-in `GITHUB_TOKEN` (prevents recursive push-triggered workflows).
- A PAT or GitHub App token used for promotion would trigger duplicate deployments — forbidden.
- The Worker validates HMAC timestamp + nonce + body digest before writing any R2 path.
- R2 write paths are allowlisted: `releases/`, `exams/`, `sources/`, `runs/`, `quarantine/`, `ledgers/`.

---

## Phase A — Contracts, Configuration, and Preflight

**Goal:** Establish all schemas, fix security baseline, register Terraform exam, confirm CI can push.

### A.1 Fix `.gitignore` (first action — before any credentials)

**File:** `.gitignore`

Add at the end:

```gitignore
# Local secrets — never commit
.env
.env.*
!.env.example
.dev.vars
.dev.vars.*
!.dev.vars.example
```

### A.2 Add JSON schemas

Create these five schema files under `.agent/schemas/`:

**`.agent/schemas/exam.schema.json`** — validates `data/exams.toml` entries after conversion to JSON for validation.

Key required fields: `id`, `code`, `name`, `provider`, `status`, `sync_enabled`, `schedule_category`, `sync_timeout_minutes`, `minimum_mock_questions`.

**`.agent/schemas/source.schema.json`** — validates each entry in `sources.json`.

Key required fields: `id`, `exam_ids`, `name`, `url`, `trust_tier`, `active`, `publication_mode`, `parser_adapter`.

**`.agent/schemas/question.schema.json`** — validates each question object.

Key required fields: `id`, `exam`, `examVersion`, `domain`, `objective`, `questionType`, `prompt`, `options`, `correct`, `sourceId`, `sourceLocator`, `sourceHash`, `status`, `mockEligible`.

**`.agent/schemas/release.schema.json`** — validates `public/release.json`.

Key required fields: `release_sha`, `build_timestamp`, `exams` (array with id, question counts, manifest checksums).

**`.agent/schemas/audit-summary.schema.json`** — validates step-summary diagnostic JSON.

Key required fields: `status`, `error_code`, `stage`, `exam_id`, `message`, `retryable`.

### A.3 Register Terraform Associate in `data/exams.toml`

**File:** `data/exams.toml`

Append:

```toml
[[exams]]
id = "terraform-associate"
code = "TA-004"
name = "HashiCorp Certified: Terraform Associate (004)"
provider = "HashiCorp"
status = "onboarding"
sync_enabled = true
schedule_category = "category-b"
sync_timeout_minutes = 45
source_timeout_seconds = 30
max_sources_per_run = 20
minimum_mock_questions = 60
question_shard_size = 250
duration_minutes = 60
practice_pass_percent = 70
practice_threshold_is_official = false
scoring_policy = "all_or_nothing"
terraform_version_tested = "1.12"
path = "exams/terraform-associate/"
objective_catalog = "data/objectives/terraform-associate.json"
description = "Associate-level certification covering IaC concepts, core Terraform workflow, configuration language, modules, state management, and HCP Terraform."

[exams.domain_weights]
"D1 Infrastructure as Code with Terraform" = 0
"D2 Terraform Fundamentals" = 0
"D3 Core Terraform Workflow" = 0
"D4 Terraform Configuration" = 0
"D5 Terraform Modules" = 0
"D6 Terraform State Management" = 0
"D7 Maintain Infrastructure" = 0
"D8 HCP Terraform" = 0
```

> Domain weights are set to 0 because HashiCorp does not publish official domain percentages for TA-004. The site must not display mock allocations as official facts.

### A.4 Add objectives catalog

Create `data/objectives/terraform-associate.json` with the 8 domains and all sub-objectives 1a–8d.

### A.5 Run branch-protection preflight

Before implementing Phase G, verify manually:

1. Go to: **GitHub → Settings → Branches → Branch protection rules → main**
2. Confirm either:
   - No protection rule exists for `main`, OR
   - The rule exists but **does not** require pull requests for `github-actions[bot]`, OR
   - "Allow specified actors to bypass required pull requests" includes `github-actions[bot]`.
3. If all direct pushes to `main` require a PR (enterprise policy), Phase G will use an automation branch with GitHub auto-merge. Note this decision before continuing.
4. Confirm: **Settings → Actions → General → Workflow permissions** is set to **Read and write permissions**.

### A.6 Capture CCA-F regression baseline

Before any structural changes, run:

```bash
node scripts/validate-questions.mjs --exam cca-f
```

Record the passing question count and schema version. This is the regression baseline that Phase H must still pass.

**Checklist:**
- [ ] `.gitignore` updated with `.env*` and `.dev.vars*`
- [ ] `.agent/schemas/exam.schema.json` created
- [ ] `.agent/schemas/source.schema.json` created
- [ ] `.agent/schemas/question.schema.json` created
- [ ] `.agent/schemas/release.schema.json` created
- [ ] `.agent/schemas/audit-summary.schema.json` created
- [ ] `data/exams.toml` has `terraform-associate` with `status = "onboarding"`
- [ ] `data/objectives/terraform-associate.json` created with all 8 domains
- [ ] Branch protection preflight completed and decision recorded
- [ ] CCA-F regression baseline captured

---

## Phase B — Unified Source Registry

**Goal:** Upgrade `sources.json` to multi-exam schema v2.0.0 and register initial Terraform sources.

### B.1 Upgrade sources.json to version 2.0.0

**File:** `.agent/cert-prep-curator/sources.json`

Replace with the multi-exam structure:

```json
{
  "version": "2.0.0",
  "schema": ".agent/schemas/source.schema.json",
  "exams": {
    "cca-f": {
      "sources": [ ]
    },
    "terraform-associate": {
      "sources": [
        {
          "id": "hashicorp-ta004-cert-page",
          "exam_ids": ["terraform-associate"],
          "name": "HashiCorp Terraform Associate Certification Page",
          "url": "https://www.hashicorp.com/certifications/terraform-associate",
          "allowed_redirect_hosts": ["developer.hashicorp.com"],
          "trust_tier": "tier-1-official",
          "active": true,
          "publication_mode": "reference-only",
          "parser_adapter": "hashicorp-adapter",
          "domains": ["D1","D2","D3","D4","D5","D6","D7","D8"],
          "refresh_frequency": "weekly",
          "max_size_bytes": 524288,
          "timeout_seconds": 30
        },
        {
          "id": "hashicorp-ta004-study-guide",
          "exam_ids": ["terraform-associate"],
          "name": "HashiCorp Terraform Associate 004 Study Guide",
          "url": "https://developer.hashicorp.com/terraform/tutorials/certification-003/associate-study-v2",
          "allowed_redirect_hosts": ["developer.hashicorp.com"],
          "trust_tier": "tier-1-official",
          "active": true,
          "publication_mode": "document-source",
          "parser_adapter": "hashicorp-adapter",
          "domains": ["D1","D2","D3","D4","D5","D6","D7","D8"],
          "refresh_frequency": "weekly",
          "max_size_bytes": 2097152,
          "timeout_seconds": 30
        },
        {
          "id": "hashicorp-ta004-review-guide",
          "exam_ids": ["terraform-associate"],
          "name": "HashiCorp Terraform Associate 004 Review Guide",
          "url": "https://developer.hashicorp.com/terraform/tutorials/certification-003/associate-review-v2",
          "allowed_redirect_hosts": ["developer.hashicorp.com"],
          "trust_tier": "tier-1-official",
          "active": true,
          "publication_mode": "document-source",
          "parser_adapter": "hashicorp-adapter",
          "domains": ["D1","D2","D3","D4","D5","D6","D7","D8"],
          "refresh_frequency": "weekly",
          "max_size_bytes": 2097152,
          "timeout_seconds": 30
        },
        {
          "id": "hashicorp-ta004-sample-questions",
          "exam_ids": ["terraform-associate"],
          "name": "HashiCorp Terraform Associate Official Sample Questions",
          "url": "https://developer.hashicorp.com/terraform/tutorials/certification-003/associate-questions",
          "allowed_redirect_hosts": ["developer.hashicorp.com"],
          "trust_tier": "tier-1-official",
          "active": true,
          "publication_mode": "question-source",
          "parser_adapter": "hashicorp-adapter",
          "domains": ["D1","D2","D3","D4","D5","D6","D7","D8"],
          "refresh_frequency": "weekly",
          "max_size_bytes": 524288,
          "timeout_seconds": 30
        }
      ]
    }
  }
}
```

### B.2 Migrate CCA-F sources into new format

Move existing CCA-F source entries from the old flat format into the `exams.cca-f.sources` array, preserving all existing fields and adding any missing required fields (`exam_ids`, `trust_tier`, `publication_mode`, `parser_adapter`).

### B.3 Update source-registry consumers

Update these files to read from `exams.<exam-id>.sources` instead of the flat top-level `sources` array:

- `.agent/cert-prep-curator/sync-sources.mjs` — add exam parameter; load exam-specific sources
- `.agent/cert-prep-curator/cli.mjs` — pass exam ID through all source operations
- `.agent/cert-prep-curator/validate-output.mjs` — validate against exam-specific source list
- `.agent/cert-prep-curator/preflight.mjs` — validate registry structure for all registered exams

### B.4 Generate plan/sources.md from registry

Update or create a script that reads `sources.json` and renders `plan/sources.md` as a human-readable cross-certification source table. The markdown file is **generated output** — it must not be manually maintained as a second source of truth.

**Checklist:**
- [ ] `sources.json` upgraded to v2.0.0 with namespaced exam keys
- [ ] CCA-F sources migrated into `exams.cca-f.sources`
- [ ] Initial Terraform Associate Tier-1 official sources registered
- [ ] `sync-sources.mjs` updated for multi-exam source loading
- [ ] `cli.mjs` passes exam ID through source operations
- [ ] `validate-output.mjs` validates against exam-specific sources
- [ ] `preflight.mjs` validates all exam source registries
- [ ] `plan/sources.md` is generated from the JSON registry

---

## Phase C — Source-Only Ingestion and Timeout Handling

**Goal:** Remove all AI question generation. Make extraction strictly source-present. Handle matrix timeouts as structured failures.

### C.1 Remove AI question generation

- **Delete** `.agent/cert-prep-curator/extract-ai.mjs`
- Remove `GEMINI_API_KEY` from all workflow files
- Replace `extract-ai` CLI command with `sync` (source-present extraction only)
- Verify no remaining code imports from `extract-ai.mjs`

### C.2 Enforce source-present extraction contract

In `sync-sources.mjs`, add strict enforcement:

```javascript
// Every extracted record MUST have all of:
// - prompt: found verbatim in source content
// - options: found in source content
// - correct: found in source content
// - explanation: found in source content OR marked practice-only
// - sourceId: registered active source ID
// - sourceLocator: page/section identifier within source
// - sourceHash: SHA-256 of source content at extraction time
// If ANY required field is absent → reject record with PARSE_MISSING_FIELD
```

### C.3 Implement `EXAM_JOB_MISSING_RESULT` structured failure

In the promotion job (`curate-certifications.yml`), for each exam in the matrix:

```javascript
// If artifact download fails (job was killed by timeout or runner error):
const missingResult = {
  status: "failed",
  error_code: "EXAM_JOB_MISSING_RESULT",
  exam_id: examId,
  message: "Matrix job did not upload an artifact (timeout or runner failure)",
  retryable: true,
  previous_data_retained: true
};
// Write to diagnostics; retain previous canonical data for this exam
```

### C.4 Update deduplication to preserve source wording

In `.agent/cert-prep-curator/deduplicate.mjs`:
- Compare normalized text for exact duplicates — reject the later duplicate
- For near-duplicates (semantic similarity above threshold) — keep the version with a more complete explanation; do not rewrite either
- Never alter the original source wording when retaining a record

**Checklist:**
- [ ] `extract-ai.mjs` deleted
- [ ] `GEMINI_API_KEY` removed from all workflows
- [ ] `sync-sources.mjs` enforces source-present fields
- [ ] Promotion job synthesizes `EXAM_JOB_MISSING_RESULT` for missing artifacts
- [ ] `deduplicate.mjs` preserves source wording

---

## Phase D — Multi-Exam Browser Engine and Post-Hugo Artifacts

**Goal:** Support three question types. Generate browser-ready shards after Hugo builds. Remove static/data duplication.

### D.1 Update `question-reveal.js` (replaced file)

**File:** `static/js/question-reveal.js`

The current file only handles `single_choice`. Replace with a multi-type engine that:

- Reads `questionType` from question data: `true_false`, `single_choice`, `multiple_choice`
- Renders radio buttons for `true_false` and `single_choice`
- Renders checkboxes for `multiple_choice`
- Enforces strict 0/1 all-or-nothing scoring for `multiple_choice`:
  - Score = 1 only if the submitted answer set exactly matches the correct set
  - Score = 0 for any partial selection (even if some correct options are selected)
  - Learning mode shows which options were missed or incorrectly selected, without awarding partial credit
  - A visible label must state: "Scoring: all-or-nothing (simulator policy, not HashiCorp's confirmed algorithm)"
- Resolves exam ID from `data-exam-id` attribute on the page container (not hardcoded `cca-f`)

### D.2 Update `mock-test.js`

**File:** `static/js/mock-test.js`

- Resolve exam config dynamically from `data-exam-id`
- Load domain quotas from `public/data/exams/<exam-id>/manifest.json`
- Apply per-exam pass percent (CCA-F: 72%, Terraform: 70%)
- Render all three question types using the same engine as `question-reveal.js`
- Apply strict 0/1 multi-select scoring

### D.3 Create browser artifact builder script

**File:** `scripts/build-browser-artifacts.mjs`

This script runs **after** Hugo builds, not before. It:

1. Reads `data/questions/<exam-id>/questions.json` for each active/onboarding exam
2. Filters to `status = "ready"` questions only
3. Groups by domain
4. Splits each domain's questions into 250-item shards:
   - `public/data/exams/<exam-id>/domain-D1-shard-1.json`
   - `public/data/exams/<exam-id>/domain-D1-shard-2.json` (if D1 > 250)
5. Generates `public/data/exams/<exam-id>/manifest.json`:
   ```json
   {
     "exam_id": "terraform-associate",
     "release_sha": "<from environment>",
     "generated_at": "<ISO timestamp>",
     "schema_version": "2.0.0",
     "shard_size": 250,
     "domains": {
       "D1": { "total": 85, "shards": 1, "files": ["domain-D1-shard-1.json"], "checksum": "sha256:..." }
     },
     "totals": { "domains": 8, "questions": 680, "mock_eligible": 420 }
   }
   ```
6. Generates `public/data/exams/<exam-id>/mock-index.json` with mock-eligible question IDs and domain distribution
7. Generates root `public/release.json`:
   ```json
   {
     "release_sha": "<promoted commit SHA>",
     "build_timestamp": "<ISO timestamp>",
     "exams": [
       { "id": "cca-f", "status": "active", "question_count": 1130, "manifest_checksum": "sha256:..." },
       { "id": "terraform-associate", "status": "onboarding", "question_count": 0, "manifest_checksum": "sha256:..." }
     ]
   }
   ```

### D.4 Create live release verifier

**File:** `scripts/verify-live-release.mjs`

Fetches `https://imashishchawla.github.io/ai-certification-preparation/release.json` and asserts:
- HTTP 200
- `release_sha` matches the expected promoted SHA (passed as `EXPECTED_SHA` environment variable)
- Timeout: 30 seconds
- Retries: 3 with 10-second delay between attempts
- On failure: exits non-zero with `VERIFY_SHA_MISMATCH` error code

### D.5 Delete `static/data/questions/cca-f/questions.json`

This file is a duplicate of the canonical `data/questions/cca-f/questions.json` and will be replaced by the post-Hugo generated shards in `public/`. Remove it and ensure nothing in the build pipeline reads from `static/data/` for question data.

**Checklist:**
- [ ] `question-reveal.js` replaced with multi-type engine
- [ ] `mock-test.js` updated for dynamic exam binding and multi-type scoring
- [ ] `scripts/build-browser-artifacts.mjs` created (runs post-Hugo)
- [ ] `scripts/verify-live-release.mjs` created
- [ ] `static/data/questions/cca-f/questions.json` deleted
- [ ] Browser artifact counts verified: CCA-F = 9 files, Terraform = 10 files, total = 19

---

## Phase E — Terraform Associate Content (Onboarding)

**Goal:** Create all 8-domain content structure, register official sources, ingest verified questions.

### E.1 Create content directory structure

```
content/exams/terraform-associate/
├── _index.md                              (Exam overview, duration 60min, version 004, Terraform 1.12)
├── sample-questions/_index.md             (Practice questions landing)
├── mock-test/_index.md                    (Timed mock exam landing — hidden until status = active)
├── study-guides/
│   ├── _index.md                          (Study guides index)
│   ├── 01-iac-fundamentals.md             (D1: IaC concepts, multi-cloud, hybrid-cloud)
│   ├── 02-terraform-fundamentals.md       (D2: Providers, versions, state purpose)
│   ├── 03-core-workflow.md                (D3: init, validate, plan, apply, destroy, fmt)
│   ├── 04-terraform-configuration.md      (D4: Resources, data sources, variables, outputs, lifecycle)
│   ├── 05-modules.md                      (D5: Sources, scope, composition, Registry)
│   ├── 06-state-management.md             (D6: Local backend, locking, remote state, drift)
│   ├── 07-maintain-infrastructure.md      (D7: Import, state inspection, verbose logging)
│   └── 08-hcp-terraform.md               (D8: Workspaces, projects, collaboration, governance)
├── exam-notes/
│   ├── _index.md
│   └── 004-exam-differences.md           (003 vs 004 traps and distractors)
├── study-materials/_index.md              (Official documentation index)
├── resources/
│   ├── _index.md
│   └── terraform-cli-cheatsheet.md       (CLI command quick reference)
├── labs/_index.md
└── glossary/_index.md
```

### E.2 Key content rules

- Every study guide page must map to exactly one domain ID (`D1`–`D8`).
- Domain names must match the official HashiCorp names verbatim.
- Do not state domain percentages or pass scores — HashiCorp does not publish them for TA-004.
- The `mock-test` section must not appear in public navigation or mock exam draws until `status = active`.
- The `004-exam-differences.md` must document only verified differences between 003 and 004 objectives.

### E.3 Create initial Terraform question bank

**File:** `data/questions/terraform-associate/questions.json`

Initial structure (empty bank ready for source ingestion):

```json
{
  "version": "2.0.0",
  "exam": "terraform-associate",
  "examVersion": "004",
  "generated": "<timestamp>",
  "questions": []
}
```

Questions are populated by the curator agent from registered Tier-1 sources. No questions may be manually invented or copied without full provenance.

### E.4 Create working directories

```bash
mkdir -p .data/exams/terraform-associate/raw
mkdir -p .data/exams/terraform-associate/extracted
touch .data/exams/terraform-associate/raw/.gitkeep
touch .data/exams/terraform-associate/extracted/.gitkeep
mkdir -p static/assets/terraform-associate/pdfs
mkdir -p static/assets/terraform-associate/documents
touch static/assets/terraform-associate/pdfs/.gitkeep
touch static/assets/terraform-associate/documents/.gitkeep
```

**Checklist:**
- [ ] All content directory structure created
- [ ] `_index.md` files created for all 10 subdirectories
- [ ] 8 domain study guides created with correct domain names
- [ ] `004-exam-differences.md` created
- [ ] `terraform-cli-cheatsheet.md` created
- [ ] `data/questions/terraform-associate/questions.json` created (empty bank)
- [ ] Working directories and `.gitkeep` files created
- [ ] No invented questions or unofficial domain percentages anywhere in content

---

## Phase F — Cloudflare Worker and R2 Proxy

**Goal:** Rewrite Worker with correct crons, fail-closed category routing, HMAC proxy, and R2 binding.

### F.1 Update `wrangler.toml`

**File:** `cloudflare/cert-prep-curator-worker/wrangler.toml`

Replace entirely:

```toml
name = "cert-prep-curator-worker"
main = "src/index.mjs"
compatibility_date = "2026-09-01"

[vars]
AGENT_NAME = "cert-prep-curator"
AGENT_VERSION = "2.0.0"
GITHUB_REPO = "imashishchawla/ai-certification-preparation"
GITHUB_AUTH_MODE = "pat"   # Change to "app" when GitHub App is configured

# Required secrets (set via "wrangler secret put"):
# GITHUB_DISPATCH_TOKEN  — PAT or GitHub App private key
# STATUS_HMAC_SECRET     — shared HMAC key with GitHub Actions

[triggers]
crons = [
  "30 18 * * 6",   # Category A primary: Sat 18:30 UTC = Sun 00:00 IST
  "30 18 * * 0"    # Category B primary: Sun 18:30 UTC = Mon 00:00 IST
]

[[r2_buckets]]
binding = "CONTROL_BUCKET"
bucket_name = "certification-control"
```

### F.2 Create HMAC verification module

**File:** `cloudflare/cert-prep-curator-worker/src/hmac.mjs`

```javascript
/**
 * Verify an HMAC-SHA256 signature from GitHub Actions.
 * Expects header: X-Hub-Signature-256: sha256=<hex>
 * Expects header: X-Timestamp: <unix-seconds>
 * Expects header: X-Nonce: <random-uuid>
 */
export async function verifyHmac(request, secret) {
  const signature = request.headers.get("X-Hub-Signature-256");
  const timestamp = request.headers.get("X-Timestamp");
  const nonce = request.headers.get("X-Nonce");

  if (!signature || !timestamp || !nonce) {
    return { valid: false, reason: "AUTH_MISSING_HEADERS" };
  }

  // Reject timestamps more than 5 minutes old
  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
  if (age > 300) {
    return { valid: false, reason: "AUTH_TIMESTAMP_EXPIRED" };
  }

  const body = await request.clone().text();
  const message = `${timestamp}.${nonce}.${body}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );
  const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const expectedHex = "sha256=" + Array.from(new Uint8Array(expectedSig))
    .map(b => b.toString(16).padStart(2, "0")).join("");

  const valid = signature === expectedHex;
  return { valid, reason: valid ? null : "AUTH_INVALID_SIGNATURE" };
}
```

### F.3 Create R2 proxy module

**File:** `cloudflare/cert-prep-curator-worker/src/r2-proxy.mjs`

```javascript
// Allowlisted R2 path prefixes — reject any write outside these
const ALLOWED_PREFIXES = [
  "releases/",
  "exams/",
  "sources/",
  "runs/",
  "quarantine/",
  "ledgers/"
];

export async function writeR2(bucket, path, data) {
  const allowed = ALLOWED_PREFIXES.some(prefix => path.startsWith(prefix));
  if (!allowed) {
    throw new Error(`LEDGER_PATH_NOT_ALLOWED: ${path}`);
  }
  const body = JSON.stringify(data, null, 2);
  await bucket.put(path, body, {
    httpMetadata: { contentType: "application/json" },
    customMetadata: { "written-at": new Date().toISOString() }
  });
}

export async function readR2(bucket, path) {
  const object = await bucket.get(path);
  if (!object) return null;
  return JSON.parse(await object.text());
}
```

### F.4 Rewrite `index.mjs`

**File:** `cloudflare/cert-prep-curator-worker/src/index.mjs`

Key changes from the current version:

```javascript
// Fail-closed category routing
const CATEGORY_BY_CRON = {
  "30 18 * * 6": "category-a",
  "30 18 * * 0": "category-b",
};

export default {
  // Scheduled handler — dispatches GitHub curation workflow
  async scheduled(event, env, ctx) {
    const scheduleCategory = CATEGORY_BY_CRON[event.cron];
    if (!scheduleCategory) {
      throw new Error(`CONFIG_UNREGISTERED_SCHEDULE: ${event.cron}`);
    }

    // Check R2 ledger — exit if this category/week already started
    const weekKey = getWeekKey();
    const ledgerPath = `ledgers/categories/${scheduleCategory}/${weekKey}.json`;
    const existing = await readR2(env.CONTROL_BUCKET, ledgerPath);
    if (existing?.status === "running" || existing?.status === "completed") {
      console.log(`[Worker] ${scheduleCategory}/${weekKey} already recorded — skipping`);
      return;
    }

    // Record run start in ledger
    await writeR2(env.CONTROL_BUCKET, ledgerPath, {
      scheduleCategory,
      weekKey,
      status: "running",
      triggeredBy: "cloudflare-worker",
      startedAt: new Date().toISOString()
    });

    // Dispatch GitHub curation workflow
    const token = await resolveGitHubToken(env);
    const response = await fetch(
      `https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "cert-prep-curator-worker/2.0.0",
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event_type: "certification-curation",
          client_payload: {
            scheduleCategory,
            triggeredBy: "cloudflare-worker",
            weekKey
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`AUTH_DISPATCH_FAILED: HTTP ${response.status}`);
    }
    console.log(`[Worker] Dispatched certification-curation for ${scheduleCategory}`);
  },

  // Fetch handler — serves status API and HMAC proxy
  async fetch(request, env, ctx) {
    // ... /api/v1/status (HMAC-authenticated R2 write proxy)
    // ... /api/v1/curate (authenticated manual dispatch)
    // ... /api/v1/exams  (exam catalog from R2)
    // ... /health        (liveness check)
  }
};
```

### F.5 Update Worker package.json

**File:** `cloudflare/cert-prep-curator-worker/package.json`

Add crypto utilities (native Web Crypto is available in Workers — no npm dep needed for HMAC). Update wrangler version:

```json
{
  "name": "cert-prep-curator-worker",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest"
  },
  "devDependencies": {
    "wrangler": "^3.100.0",
    "vitest": "^2.0.0"
  }
}
```

**Checklist:**
- [ ] `wrangler.toml` updated with correct crons, R2 binding, `GITHUB_AUTH_MODE`
- [ ] Hardcoded `EXAM_CODE` and `TOTAL_QUESTIONS` removed from `wrangler.toml`
- [ ] `cloudflare/cert-prep-curator-worker/src/hmac.mjs` created
- [ ] `cloudflare/cert-prep-curator-worker/src/r2-proxy.mjs` created
- [ ] `index.mjs` rewritten with fail-closed category routing and HMAC proxy
- [ ] Worker deploys successfully via `wrangler deploy`
- [ ] `wrangler secret put GITHUB_DISPATCH_TOKEN` completed
- [ ] `wrangler secret put STATUS_HMAC_SECRET` completed
- [ ] R2 bucket `certification-control` exists

---

## Phase G — GitHub Workflow Separation

**Goal:** Delete old workflow, create new curator workflow, fix deploy.yml.

### G.1 Delete `weekly-curator.yml`

**File:** `.github/workflows/weekly-curator.yml` — delete entirely.

This workflow:
- Uses `GEMINI_API_KEY` and `extract-ai cca-f` (both prohibited)
- Deploys Pages directly (violates single-publisher rule)
- Uses wrong cron schedule
- Cannot receive `repository_dispatch` from Worker

### G.2 Create `curate-certifications.yml`

**File:** `.github/workflows/curate-certifications.yml`

Triggers:

```yaml
on:
  repository_dispatch:
    types: [certification-curation]
  schedule:
    - cron: "45 18 * * 6"   # Category A fallback: Sun 00:15 IST
    - cron: "45 18 * * 0"   # Category B fallback: Mon 00:15 IST
  workflow_dispatch:
    inputs:
      schedule_category:
        description: "category-a or category-b (leave blank for auto-detect)"
        required: false
        type: string
```

Concurrency:

```yaml
concurrency:
  group: curate-${{ github.event.client_payload.scheduleCategory || inputs.schedule_category || 'manual' }}
  cancel-in-progress: false
```

Jobs structure with correct permissions:

```yaml
jobs:
  prepare:
    permissions:
      contents: read
    # Stage 01-04: resolve category, validate config, check ledger, build matrix

  curate:
    needs: prepare
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        exam: ${{ fromJSON(needs.prepare.outputs.matrix) }}
    name: "${{ matrix.exam.id }} • curate and validate"
    # Stage 05-08: fetch, parse, validate, upload artifact

  promote:
    needs: curate
    permissions:
      contents: write
    # Stage 09-10: combine, revalidate, single promotion commit

  deploy:
    needs: promote
    permissions:
      contents: read
      pages: write
      id-token: write
    uses: ./.github/workflows/deploy.yml
    with:
      release_sha: ${{ needs.promote.outputs.release_sha }}
    secrets:
      STATUS_HMAC_SECRET: ${{ secrets.STATUS_HMAC_SECRET }}
```

### G.3 Update `deploy.yml`

**File:** `.github/workflows/deploy.yml`

Replace entirely:

```yaml
name: Deploy to GitHub Pages

on:
  workflow_call:
    inputs:
      release_sha:
        required: true
        type: string
    secrets:
      STATUS_HMAC_SECRET:
        required: true
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      release_sha:
        description: "Commit SHA to deploy (leave blank for HEAD)"
        required: false
        type: string

concurrency:
  group: github-pages-production
  cancel-in-progress: false

jobs:
  prepare:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    outputs:
      target_sha: ${{ steps.resolve.outputs.target_sha }}
    steps:
      - name: "01 Resolve target SHA"
        id: resolve
        run: |
          SHA="${{ inputs.release_sha || github.sha }}"
          echo "target_sha=$SHA" >> "$GITHUB_OUTPUT"

  build-and-deploy:
    needs: prepare
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: "11 Build Hugo"
        uses: actions/checkout@v4
        with:
          ref: ${{ needs.prepare.outputs.target_sha }}
          submodules: recursive
          fetch-depth: 0

      - uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: '0.166.0'
          extended: true

      - run: hugo --minify --baseURL "https://imashishchawla.github.io/ai-certification-preparation/"

      - name: "12 Generate browser artifacts"
        env:
          RELEASE_SHA: ${{ needs.prepare.outputs.target_sha }}
        run: node scripts/build-browser-artifacts.mjs

      - name: "13 Run release tests"
        run: |
          node scripts/validate-questions.mjs --exam cca-f
          node scripts/check-external-links.mjs
          node scripts/audit-rendered-pages.mjs

      - name: "14 Deploy GitHub Pages"
        id: upload
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

      - uses: actions/deploy-pages@v4
        id: deployment

      - name: "15 Verify live release"
        env:
          EXPECTED_SHA: ${{ needs.prepare.outputs.target_sha }}
        run: node scripts/verify-live-release.mjs

      - name: "16 Record final run status"
        if: always()
        env:
          STATUS_HMAC_SECRET: ${{ secrets.STATUS_HMAC_SECRET }}
          CURATOR_WORKER_URL: ${{ vars.CURATOR_WORKER_URL }}
          RELEASE_SHA: ${{ needs.prepare.outputs.target_sha }}
          JOB_STATUS: ${{ job.status }}
        run: node scripts/lib/hmac-client.mjs record-deployment-status
```

**Checklist:**
- [ ] `.github/workflows/weekly-curator.yml` deleted
- [ ] `.github/workflows/curate-certifications.yml` created with correct triggers, concurrency, and 4-job structure
- [ ] `.github/workflows/deploy.yml` updated with `workflow_call` trigger, preparation job, `github-pages-production` concurrency, and browser artifact generation step
- [ ] `deploy.yml` no longer deploys on its own from push alone (push trigger is kept for manual emergency deploys only — curator is the normal path)
- [ ] Matrix jobs have `contents: read` only (cannot push)
- [ ] Promotion job has `contents: write`
- [ ] Deploy job has `pages: write` + `id-token: write`

---

## Phase H — Verification, README Update, and Release Gates

**Goal:** Run all gates, update README with correct timezone and new exam, confirm release criteria.

### H.1 Run regression tests

```bash
# CCA-F must still pass its baseline
node scripts/validate-questions.mjs --exam cca-f

# Terraform structure tests
node scripts/validate-questions.mjs --exam terraform-associate

# Browser artifact count
node scripts/build-browser-artifacts.mjs --dry-run
# Expected: CCA-F=9, Terraform=10, total=19
```

### H.2 Update README.md

**File:** `README.md`

Required changes:

1. **Sync Pulse badge** — change `MON 00:00 UTC` to `Sun/Mon 00:00 IST`:
   ```
   [![Sync Pulse](https://img.shields.io/badge/SYNC%20PULSE-Sun%2FMon%2000%3A00%20IST-00E5FF?...
   ```

2. **Weekly Sync description** — update from:
   > every Monday night at 00:00 UTC

   to:
   > Category A (CCA-F) every **Sunday 00:00 IST** and Category B (Terraform) every **Monday 00:00 IST**, coordinated by Cloudflare Workers with a 15-minute GitHub fallback.

3. **Exam Matrix section** — add Terraform Associate block:
   ```markdown
   ### 🟡 In Onboarding — Building Question Bank

   #### **HashiCorp Certified: Terraform Associate (004)**
   - **Status:** Onboarding — question bank under construction from official sources
   - **Coverage:** All 8 official domains (D1 IaC Concepts through D8 HCP Terraform)
   - **Terraform version tested:** 1.12
   - **Target:** ≥ 60 source-verified questions before public activation
   - Study guides, exam notes, and CLI cheatsheet available now
   ```

4. **"In The Pipeline" section** — move placeholder Claude entries to a separate `Planned` sub-section; Terraform Associate moves to `In Onboarding`.

### H.3 Update `content/exams/_index.md`

Update to show multi-exam hub listing. The Terraform Associate card must be hidden from public navigation (controlled by `status = "onboarding"` in the template filter — see Phase D layouts).

### H.4 Update Hugo layouts for onboarding filter

**File:** `themes/retro-prep/layouts/exams/list.html`
- Add filter: only render exam cards where `status = "active"`
- Onboarding exams must not appear in the public card grid

**File:** `themes/retro-prep/layouts/partials/nav.html`
- Navigation links: only include exams where `status = "active"`

**File:** `themes/retro-prep/layouts/index.html`
- Homepage exam grid: same active-only filter

**Checklist:**
- [ ] CCA-F regression tests pass with same question count as baseline
- [ ] Terraform validate-questions passes (empty bank is valid for `onboarding` status)
- [ ] README.md updated: badge says `Sun/Mon 00:00 IST`
- [ ] README.md updated: weekly sync description updated
- [ ] README.md updated: Terraform Associate block added under `In Onboarding`
- [ ] Hugo layouts filter out `onboarding` exams from public navigation and card grid
- [ ] `content/exams/_index.md` updated
- [ ] `content/_index.md` updated
- [ ] Worker deploys to Cloudflare with correct crons visible in the Workers dashboard
- [ ] GitHub Actions shows `curate-certifications.yml` and updated `deploy.yml`

---

## R2 Object Allowlist

The Worker will only write to these paths. Any other path must return `LEDGER_PATH_NOT_ALLOWED`:

```text
certification-control/
├── releases/
│   ├── live.json                              # Current live release pointer
│   └── last-known-good.json                   # Last verified release pointer
├── exams/
│   └── <exam-id>/status.json                  # Per-exam sync status
├── sources/
│   └── <exam-id>/<source-id>.json             # Source ETag/hash/last-check
├── runs/
│   └── <exam-id>/<run-id>-summary.json        # Run start/finish/duration/counts
├── quarantine/
│   └── <exam-id>/<record-id>-reason.json      # Rejection reasons (90-day retention)
└── ledgers/
    ├── categories/<category-id>/<yyyy-week>.json   # Category run idempotency
    └── exams/<exam-id>/<yyyy-week>.json            # Per-exam run ledger
```

R2 will never store: questions, documents, PDFs, raw source bodies, the Hugo site, or any credential.

---

## Detailed Planned File Manifest

### New Files (51)

| Path | Component | Purpose |
|---|---|---|
| `.agent/schemas/exam.schema.json` | Contracts | Validates exam catalog entries |
| `.agent/schemas/source.schema.json` | Contracts | Validates source registry entries |
| `.agent/schemas/question.schema.json` | Contracts | Validates canonical question items |
| `.agent/schemas/release.schema.json` | Contracts | Validates `/release.json` |
| `.agent/schemas/audit-summary.schema.json` | Contracts | Validates step-summary diagnostics |
| `.agent/skills/cert-curator/SKILL.md` | Skill | Curation and onboarding skill |
| `scripts/build-browser-artifacts.mjs` | Build | Post-Hugo shard generator and manifest builder |
| `scripts/verify-live-release.mjs` | Verification | Verifies live `/release.json` matches release SHA |
| `content/exams/terraform-associate/_index.md` | Content | Exam overview |
| `content/exams/terraform-associate/sample-questions/_index.md` | Content | Practice questions landing |
| `content/exams/terraform-associate/mock-test/_index.md` | Content | Mock exam landing |
| `content/exams/terraform-associate/study-guides/_index.md` | Content | Study guides index |
| `content/exams/terraform-associate/study-guides/01-iac-fundamentals.md` | Content | D1 study guide |
| `content/exams/terraform-associate/study-guides/02-terraform-fundamentals.md` | Content | D2 study guide |
| `content/exams/terraform-associate/study-guides/03-core-workflow.md` | Content | D3 study guide |
| `content/exams/terraform-associate/study-guides/04-terraform-configuration.md` | Content | D4 study guide |
| `content/exams/terraform-associate/study-guides/05-modules.md` | Content | D5 study guide |
| `content/exams/terraform-associate/study-guides/06-state-management.md` | Content | D6 study guide |
| `content/exams/terraform-associate/study-guides/07-maintain-infrastructure.md` | Content | D7 study guide |
| `content/exams/terraform-associate/study-guides/08-hcp-terraform.md` | Content | D8 study guide |
| `content/exams/terraform-associate/exam-notes/_index.md` | Content | Exam notes landing |
| `content/exams/terraform-associate/exam-notes/004-exam-differences.md` | Content | 003→004 traps |
| `content/exams/terraform-associate/study-materials/_index.md` | Content | Official docs index |
| `content/exams/terraform-associate/resources/_index.md` | Content | Resources landing |
| `content/exams/terraform-associate/resources/terraform-cli-cheatsheet.md` | Content | CLI reference |
| `content/exams/terraform-associate/labs/_index.md` | Content | Labs landing |
| `content/exams/terraform-associate/glossary/_index.md` | Content | Glossary landing |
| `data/questions/terraform-associate/questions.json` | Data | Canonical question bank |
| `data/objectives/terraform-associate.json` | Data | Official objectives D1–D8 |
| `.data/exams/terraform-associate/raw/.gitkeep` | Machine data | Working raw directory |
| `.data/exams/terraform-associate/extracted/.gitkeep` | Machine data | Working extracted directory |
| `static/assets/terraform-associate/pdfs/.gitkeep` | Static | Offline documents placeholder |
| `static/assets/terraform-associate/documents/.gitkeep` | Static | Offline reference placeholder |
| `.github/workflows/curate-certifications.yml` | Workflows | New matrix curation workflow |
| `scripts/adapters/hashicorp-adapter.mjs` | Ingestion | Parser for HashiCorp docs |
| `scripts/adapters/community-adapter.mjs` | Ingestion | Parser for community question banks |
| `scripts/lib/logger.mjs` | Observability | Structured stage logging and `::error` formatting |
| `scripts/lib/hmac-client.mjs` | Security | Signs status payloads for Worker proxy |
| `cloudflare/cert-prep-curator-worker/src/hmac.mjs` | Security | HMAC signature verification |
| `cloudflare/cert-prep-curator-worker/src/r2-proxy.mjs` | Storage | Allowlisted R2 writes |
| `.github/workflows/test-curator.yml` | Workflows | Manual test workflow for matrix jobs |
| `tests/unit/test-browser-shards.mjs` | Testing | Shard splitting and manifest integrity |
| `tests/unit/test-multi-select-scoring.mjs` | Testing | Strict 0/1 scoring algorithm |
| `tests/unit/test-hmac-signatures.mjs` | Testing | HMAC creation and verification |
| `tests/regression/test-ccaf-regression.mjs` | Testing | CCA-F question bank integrity |
| `tests/regression/test-domain-counts.mjs` | Testing | Domain question distribution |
| `content/exams/terraform-associate/study-guides/01-iac-concepts.md` | Content | Supplementary IaC notes |
| `content/exams/terraform-associate/study-guides/02-lock-files.md` | Content | Dependency lock file reference |
| `content/exams/terraform-associate/study-guides/06-backend-types.md` | Content | Remote backend architecture |
| `content/exams/terraform-associate/study-guides/07-drift-remediation.md` | Content | Drift and replace triggers |
| `tests/e2e/test-mock-exam-flow.mjs` | Testing | End-to-end quiz engine simulation |

### Modified Files (34)

| Path | Component | Changes |
|---|---|---|
| `.gitignore` | Security | Add `.env*` and `.dev.vars*` patterns |
| `data/exams.toml` | Data | Add `terraform-associate` with onboarding config |
| `plan/sources.md` | Planning | Regenerated as cross-certification source table |
| `.agent/cert-prep-curator/sources.json` | Registry | Multi-exam v2.0.0 schema |
| `.agent/cert-prep-curator/agent.toml` | Config | Updated commands and stage bindings |
| `.agent/cert-prep-curator/cli.mjs` | CLI | Exam parameterization, stage reporting |
| `.agent/cert-prep-curator/preflight.mjs` | Preflight | Multi-exam directory and schema checks |
| `.agent/cert-prep-curator/sync-sources.mjs` | Ingestion | ETag/hash checks, stage observability |
| `.agent/cert-prep-curator/deduplicate.mjs` | Deduplication | Semantic similarity, preserves source wording |
| `.agent/cert-prep-curator/validate-output.mjs` | Validation | Multi-exam validation, error annotations |
| `.agent/cert-prep-curator/scaffold-exam.mjs` | Scaffolding | Parameterized 8-domain structure |
| `scripts/validate-questions.mjs` | Validation | `--exam` flag, multi-select scoring rules |
| `scripts/normalize-questions.mjs` | Normalization | Multi-type question parsing, zero-leak check |
| `scripts/check-external-links.mjs` | Audit | Verifies zero external links across all exams |
| `scripts/audit-rendered-pages.mjs` | Audit | Verifies Hugo rendering of multi-type questions |
| `themes/retro-prep/layouts/sample-questions/list.html` | Layout | Dynamic `data-exam-id` binding |
| `themes/retro-prep/layouts/mock-test/list.html` | Layout | Dynamic timer, pass percent, exam binding |
| `themes/retro-prep/layouts/exams/list.html` | Layout | Active-only filter; hides onboarding exams |
| `themes/retro-prep/layouts/index.html` | Layout | Active-only exam card grid |
| `themes/retro-prep/layouts/partials/nav.html` | Layout | Navigation filtered by active status |
| `static/js/question-reveal.js` | Browser engine | Multi-type: true/false, single, multi-select (0/1) |
| `static/js/mock-test.js` | Browser engine | Dynamic domain quotas, multi-select grading |
| `themes/retro-prep/assets/css/main.css` | Styles | Multi-select checkbox styles and badge tweaks |
| `.github/workflows/deploy.yml` | Workflows | `workflow_call`, preparation job, concurrency, artifact gen |
| `cloudflare/cert-prep-curator-worker/wrangler.toml` | Worker config | Correct crons, R2 binding, exam-agnostic vars |
| `cloudflare/cert-prep-curator-worker/src/index.mjs` | Worker code | Fail-closed routing, HMAC, R2 proxy endpoints |
| `cloudflare/cert-prep-curator-worker/package.json` | Worker deps | Updated wrangler, add vitest |
| `package.json` | Project deps | Test runners and schema validators |
| `scripts/serve.mjs` | Dev server | Local preview with generated artifact support |
| `themes/retro-prep/layouts/study-guides/list.html` | Layout | Dynamic breadcrumbs and domain listing |
| `content/exams/_index.md` | Content | Multi-exam hub listing |
| `README.md` | Documentation | IST timezone, Terraform exam matrix entry |
| `content/_index.md` | Content | Homepage certification status update |
| `scripts/seo-spider.mjs` | Audit | Verifies sitemap and no-leak policies |

### Deleted Files (4)

| Path | Rationale |
|---|---|
| `.agent/cert-prep-curator/extract-ai.mjs` | AI question generation is prohibited |
| `.github/workflows/weekly-curator.yml` | Replaced by `curate-certifications.yml` + unified `deploy.yml` |
| `static/data/questions/cca-f/questions.json` | Replaced by post-Hugo generated shards in `public/` |
| `.agent/cert-prep-curator/sync-certyiq.mjs` | Replaced by generic registered-source adapter |

### Replaced Files (3)

| Path | Replaced by | Rationale |
|---|---|---|
| `.agent/cert-prep-curator/sources.json` | Multi-exam v2.0.0 | CCA-F-specific → namespaced multi-exam schema |
| `themes/retro-prep/layouts/sample-questions/list.html` | Exam-agnostic template | Hardcoded `cca-f` → parameterized `data-exam-id` |
| `static/js/question-reveal.js` | Multi-type engine | Single-choice only → `true_false` + `multiple_choice` |

---

## Release Acceptance Criteria

The implementation is complete only when every item below passes:

### Security
- [ ] `.gitignore` blocks `.env*` and `.dev.vars*`
- [ ] No R2 access keys in GitHub repository secrets
- [ ] `STATUS_HMAC_SECRET` set in both Cloudflare Worker secrets and GitHub repository secrets (same value)
- [ ] Worker validates HMAC timestamp, nonce, and body digest before writing to R2
- [ ] R2 writes are restricted to the six allowlisted path prefixes

### Scheduling (IST)
- [ ] Cloudflare Worker crons are `30 18 * * 6` (Cat A) and `30 18 * * 0` (Cat B) = Sunday/Monday 00:00 IST
- [ ] GitHub fallback crons are `45 18 * * 6` and `45 18 * * 0` = Sunday/Monday 00:15 IST
- [ ] Worker dispatches `certification-curation` with `scheduleCategory` payload
- [ ] Fallback checks R2 ledger and exits cleanly if Cloudflare run is recorded

### Workflow Structure
- [ ] `weekly-curator.yml` is deleted
- [ ] `curate-certifications.yml` exists with correct triggers, concurrency, and 4-job structure
- [ ] Matrix jobs have `contents: read` — cannot commit or push
- [ ] One promotion job owns all canonical commits with bounded retry
- [ ] `deploy.yml` is the only production publisher under `github-pages-production` concurrency
- [ ] `deploy.yml` preparation job resolves and validates `release_sha` before checkout

### Question and Content Integrity
- [ ] `extract-ai.mjs` is deleted; no AI generation anywhere in the pipeline
- [ ] `GEMINI_API_KEY` reference removed from all workflow files
- [ ] Every question in the bank has `sourceId`, `sourceLocator`, and `sourceHash`
- [ ] No invented questions exist in any exam's question bank
- [ ] Terraform Associate is in `data/exams.toml` with `status = "onboarding"`

### Browser and Deployment
- [ ] `question-reveal.js` handles `true_false`, `single_choice`, `multiple_choice`
- [ ] Multi-select scoring is strict 0/1 all-or-nothing with visible policy label
- [ ] Browser shards generated into `public/data/exams/<exam-id>/` post-Hugo
- [ ] Initial shard count: CCA-F = 9 files, Terraform = 10 files, total = 19
- [ ] `public/release.json` contains verified `release_sha`
- [ ] Live `/release.json` reports expected `release_sha` after deployment

### Observability
- [ ] All 16 named stages appear in GitHub Actions UI
- [ ] Every failure emits `::error` annotation and `$GITHUB_STEP_SUMMARY` row
- [ ] Missing matrix artifacts produce structured `EXAM_JOB_MISSING_RESULT` records
- [ ] Final run status written to R2 via HMAC proxy with `if: always()`

### Regressions
- [ ] CCA-F question count matches pre-implementation baseline
- [ ] CCA-F mock exam and practice pages function correctly
- [ ] Terraform study guides, exam notes, and cheatsheet render without broken links
- [ ] Onboarding exams hidden from public navigation, card grid, and mock exam draws

### README and Documentation
- [ ] `README.md` badge says `Sun/Mon 00:00 IST` (not `MON 00:00 UTC`)
- [ ] `README.md` weekly sync description updated with IST timezone and two-category schedule
- [ ] `README.md` includes Terraform Associate under `In Onboarding` section

---

## Final Outcome

- GitHub Pages serves the validated multi-certification website with CCA-F active and Terraform Associate onboarding.
- Cloudflare Workers schedules Category A (Sunday 00:00 IST) and Category B (Monday 00:00 IST) with fail-closed routing.
- R2 stores only compact operational JSON accessed exclusively via HMAC-signed Worker proxy.
- GitHub remains the canonical question and documentation database — no content in R2.
- Terraform Associate enters `onboarding` and activates only when ≥ 60 source-backed questions pass all release gates.
- Multi-select questions score strictly 0/1 without partial credit, with a visible policy label.
- Every published question is traceable to an approved registered source; zero questions are generated.
- The +15-minute staggered fallback prevents duplicate execution.
- 16 named workflow stages and structured error codes provide complete observability.
- Branch protection is verified before the first automated promotion push runs.
