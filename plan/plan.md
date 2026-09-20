---
title: "AI Certification Preparation Site — Master Implementation Blueprint"
date: 2026-09-20
status: planning
---

# AI Certification Preparation Site — Master Implementation Blueprint

This master document incorporates all research, inventory audits, structural decisions, UI specifications, quiz engine requirements, automation agent workflows, and Cloudflare integration designs gathered during repo analysis.

**No code or file implementation is included in this document.** Implementation begins only after this plan is reviewed and approved.

---

## 1. Product Goal & Strategy

Build a free, self-contained, retro-styled AI certification preparation website hosted statically on **GitHub Pages**.

The launch certification is:

> **Claude Certified Architect — Foundations**  
> Internal ID: `cca-f` · Display label: `CCAF` / `CCAR-F`

The product architecture is **exam-first** and **multi-tenant ready**. Adding future AI certifications (e.g., `ccar-p` Professional, `ccao-f` Associate) follows a standard template without modifying shared theme templates, quiz engines, or core scripts.

For every published certification, the site provides two primary interactive test modes:

1. **Sample Questions** — browse, study, and practice the entire collected question bank item-by-item.
2. **Mock Test** — a simulated 60-question, 120-minute timed practice exam with domain balancing, timer, and score report.

Supporting content for each exam is organized into distinct subdirectories:
- Study Guides
- Exam Notes
- Articles
- Study Materials (PDFs and official documentation)
- Resources (cheat sheets, flashcards, glossary, scenarios)

---

## 2. Infrastructure & Hosting Architecture

### GitHub Pages (Primary Web Host)
- **Role:** Static asset host for HTML, CSS, client-side JS, images, and PDFs.
- **Constraints:** Zero server-side execution, zero server sessions, zero native authentication, zero database.
- **No external links policy:** Published pages contain **zero external links** (no external `href`s, no external images, no CDN stylesheets, no Google Fonts, no external icons, and no GitHub repository links in footers/nav). All provenance URLs remain private inside `.agent/` and `plan/sources.md`.

### Hugo (Static Site Generator)
- **Role:** Build tool that compiles Markdown content, structured JSON data, layout templates, CSS, and client JS into static output inside `public/`.
- **Why Hugo is retained:**
  - The repository already exists as a Hugo project (`hugo.toml` + `themes/ccaf-theme/`).
  - Contains 100+ authored Markdown files with front matter.
  - Pinned GitHub Action (`.github/workflows/deploy.yml`) already builds Hugo 0.166.0 extended and deploys to GitHub Pages.
  - Hugo generates routing, exam indexes, section breadcrumbs, tags, and category listings at build time with zero runtime server overhead.

### Cloudflare (Secondary Automation Engine — Post-Sync Phase 8)
- **Role:** Background automation worker for checking external source URLs, storing raw snapshots in R2/D1, detecting content changes, and opening review Pull Requests via the GitHub API.
- **Timing:** Implemented only **after** the core site is structured, validated, synced to GitHub, and deployed successfully via GitHub Pages.
- **Separation:** Cloudflare does not host the website or write directly to the `main` branch.

---

## 3. Existing Repository Audit & Baseline Inventory

The application root is the nested Git repository at `ccaf-exam/`.

### Source Material Inventory

#### 1. Question Banks (~1,295 Total Questions)

| Source / Bank | Questions | Format / Answer Key Status |
|---|---:|---|
| **claudecertificationguide.com** (Walter) | 257 Q | Single + multi-choice, full per-option rationales, domain mapping |
| **claudecertifiedarchitects.com** (app.js mined) | 400 Q | Mined client bundle, 43 multi-response + 357 single-choice, full explanations |
| **Amey-Thakur Question Bank** (JSON + MD) | 320 Q | Raw 320-Q JSON bank + 80 architect Qs with rationale |
| **cca-prep** (claudecertprep.com) | 170 Q | 170 scenario Qs, 4 difficulty tiers, why-wrong explanations |
| **Paullarionov Guide** | 88 Q | 88 situation-based scenario Qs grouped by exam domain |
| **Amey-Thakur Timed Mocks (3 exams)** | ~60 Q | 3 timed mock exams (15 Q / 30 min each) with answer keys |
| **Total Collected** | **~1,295 Q** | All local; require normalization to 4 options (A–D) |

#### 2. PDF Document Roster (`pdfs/` → `static/assets/cca-f/pdfs/`)

| File Name | Size | Description |
|---|---:|---|
| `official-exam-guide-nehasharma.pdf` | 583 KB | Anthropic official 40-page v1.0 Foundations Exam Guide |
| `official-exam-guide-39page-webb.archive.pdf` | 583 KB | Official guide recovered via Wayback Machine (backup digest) |
| `official-exam-guide-ccar-professional.pdf` | 358 KB | Official CCAR-P v1.0 Professional Guide (11 pp) |
| `exam-guide-amey-thakur.pdf` | 39 pp | Official v1.0 exam guide printout ($125 fee, task statements) |
| `dnacenta-guide_en.pdf` | 83 pp | Community study guide by dnacenta |
| `cca-f-exam-guide-claudearchitectcert.pdf` | 12 pp | 2-week study plan, concept checklist, test-day checklist |
| `guide_en-github.pdf` | ~80 pp | Paullarionov community study guide PDF |
| `claude-certifications-companion.pdf` | 2.1 MB | Printable companion covering all four Claude certifications |

#### 3. Official Documentation Inventory (`static/official-docs/`)
26 scraped Markdown documentation pages covering:
- Anthropic Engineering: *Building Effective Agents*, *Claude Code Best Practices*
- Claude Code CLI Docs: `memory`, `skills`, `hooks`, `cli-reference`, `mcp`, `tools`, `github-actions`, `settings`, `permissions`, `agent-sdk/sessions`
- Anthropic Platform Docs: `agent-sdk/overview`, `agent-sdk/hooks`, `agents-and-tools/tool-use/overview`, `build-with-claude/tool-use`, `prompt-engineering-best-practices`, `batch-processing`, `api/messages`
- Model Context Protocol (MCP): `docs/concepts/tools`, `docs/concepts/resources`, `specification`
- Index files: `INDEX-code.claude.com.txt`, `INDEX-docs.anthropic.com.txt`, `INDEX-modelcontextprotocol.io.txt`

### Codebase Smells & Cleanup Items

1. **Configuration Errors:** `hugo.toml` contains placeholder repository URL `your-org/ccaf-exam` and stray invalid config lines.
2. **Hardcoded Navigation:** `themes/ccaf-theme/layouts/_default/baseof.html` hardcodes nav links to flat `/practice/`, `/study/`, `/articles/`, `/pdfs/`, `/sources/`.
3. **Drifting Duplicates:** Root `practice-questions/` and `study-guides/` mirror `content/practice/` and `content/study/`.
4. **Tracked Build Artifacts:** `public/` is tracked in Git despite being in `.gitignore`. `hugo.log` and `.hugo_build.lock` exist in working tree.
5. **Raw HTML Permissiveness:** `markup.goldmark.renderer.unsafe = true` allows raw HTML; must be sanitized.
6. **External URL Leaks:** Front matter contains `source_url` values rendered on single pages; footer contains external GitHub links.

---

## 4. Final Clean Repository Directory Structure

```text
ccaf-exam/
├── plan/
│   ├── plan.md                     # Master implementation blueprint (this file)
│   └── sources.md                  # Private provenance catalog & status history
├── content/
│   └── exams/
│       ├── _index.md               # Home page listing all AI certification exams
│       └── cca-f/
│           ├── _index.md           # CCAF Exam Landing Page
│           ├── sample-questions/
│           │   └── _index.md       # Interactive practice catalog
│           ├── mock-test/
│           │   └── _index.md       # 60Q / 120M timed exam engine shell
│           ├── study-guides/
│           │   └── _index.md       # Domain deep-dives & theory guides
│           ├── exam-notes/
│           │   └── _index.md       # Cheat sheets & summary notes
│           ├── articles/
│           │   └── _index.md       # Technical articles & cost analyses
│           ├── study-materials/
│           │   └── _index.md       # Official docs & PDF catalog
│           └── resources/
│               └── _index.md       # Flashcards, glossary, scenarios, anti-patterns
├── data/
│   ├── exams.toml                  # Central exam registry
│   └── questions/
│       └── cca-f/
│           └── questions.json      # Canonical normalized question dataset
├── assets/
│   └── js/
│       ├── question-reveal.js      # Reveal / Unreveal card interaction logic
│       └── mock-test.js            # Timed exam state machine, timer, results
├── static/
│   └── assets/
│       └── cca-f/
│           ├── pdfs/               # Exam guide PDFs
│           └── documents/          # Official scraped docs
├── themes/
│   └── retro-prep/                 # Canonical single theme folder
│       ├── layouts/
│       │   ├── _default/
│       │   │   ├── baseof.html
│       │   │   ├── list.html
│       │   │   └── single.html
│       │   ├── exams/
│       │   │   └── single.html     # Exam overview dashboard layout
│       │   ├── sample-questions/
│       │   │   └── list.html       # Sample questions filterable renderer
│       │   ├── mock-test/
│       │   │   └── single.html     # Fullscreen retro exam UI
│       │   └── partials/
│       │       ├── head.html
│       │       ├── nav.html        # Top bar with logo, dropdowns, theme toggle
│       │       ├── breadcrumbs.html
│       │       ├── card.html
│       │       └── footer.html
│       └── assets/
│           └── css/
│               └── theme.css       # Retro styling & CSS custom properties
├── .agent/
│   └── cert-prep-curator/          # Repository-local automation agent
│       ├── agent.toml
│       ├── cli.mjs
│       ├── preflight.mjs
│       ├── sync-sources.mjs
│       ├── extract-materials.mjs
│       ├── build-questions.mjs
│       ├── detect-changes.mjs
│       ├── validate-output.mjs
│       ├── README.md
│       └── reports/
├── .data/                          # Private local ingestion & hash storage
│   └── exams/
│       └── cca-f/
│           ├── manifest.json
│           ├── sources/
│           ├── raw/
│           ├── extracted/
│           ├── questions/
│           └── changes/
├── scripts/
│   ├── validate-exams.mjs          # Registry validator
│   ├── validate-questions.mjs      # Question schema & key validator
│   ├── check-internal-links.mjs    # Hugo route checker
│   └── check-external-links.mjs    # Build output external-link scanner
├── cloudflare/                     # Cloudflare Workers adapter (Phase 8 only)
│   └── cert-prep-curator-worker/
│       ├── src/index.ts
│       ├── wrangler.toml
│       └── README.md
├── hugo.toml                       # Clean Hugo configuration
└── .github/workflows/
    ├── deploy.yml                  # Pinned Hugo → GitHub Pages deployment
    └── quality.yml                 # Automated validation workflow
```

---

## 5. Multi-Exam Registry & Extensibility Model

Exam metadata is centralized in `data/exams.toml`:

```toml
[[exams]]
id = "cca-f"
code = "CCAF"
name = "Claude Certified Architect — Foundations"
provider = "Anthropic"
status = "active"
questions = 60
duration_minutes = 120
practice_pass_percent = 72
pass_score = 720
price_usd = 125
path = "/exams/cca-f/"
description = "Foundations-level certification covering agentic architecture, tool design, Claude Code, prompt engineering, and context management."

[exams.domain_weights]
"D1 Agentic Architecture & Orchestration" = 27
"D2 Tool Design & MCP Integration" = 18
"D3 Claude Code Configuration & Workflows" = 20
"D4 Prompt Engineering & Structured Output" = 20
"D5 Context Management & Reliability" = 15

[[exams]]
id = "ccar-p"
code = "CCAR-P"
name = "Claude Certified Architect — Professional"
provider = "Anthropic"
status = "planned"
questions = 60
duration_minutes = 120
practice_pass_percent = 72
pass_score = 720
price_usd = 250
path = "/exams/ccar-p/"
description = "Advanced professional certification for enterprise multi-agent deployment and security."
```

### Adding a New Exam Workflow
1. Add a record in `data/exams.toml`.
2. Run `node scripts/new-exam.mjs --id <exam-id>`.
3. Populate content into `content/exams/<exam-id>/`.
4. Populate normalized question data into `data/questions/<exam-id>/questions.json`.
5. Run `npm run validate`.
6. Hugo automatically builds the home cards, navigation dropdowns, and exam routes. No layout or CSS changes required.

---

## 6. Two-Layer Source Material Conversion Strategy

To prevent loss of original documents, the repository maintains a strict **Two-Layer Conversion Pipeline**:

```text
Upstream Source / Upload
          ↓
.data/exams/<exam-id>/raw/           # Untouched raw files (HTML, PDF, JSON, DOCX)
          ↓
.data/exams/<exam-id>/extracted/     # Parsed text, markdown candidates, assets
          ↓ Human Review & Validation
content/exams/<exam-id>/             # Published Markdown pages
static/assets/<exam-id>/             # Published static PDFs & files
data/questions/<exam-id>/            # Published canonical question JSON
```

### Format Standardizations

- **Study Guides & Notes:** Converted from raw HTML/DOCX into clean Markdown with metadata front matter (`title`, `exam`, `domain`, `type`).
- **PDFs:** Stored in `.data/.../raw/pdfs/`, published to `static/assets/<exam-id>/pdfs/`. Referenced via internal links.
- **Question Banks:** Raw files parsed into normalized candidate JSON in `.data/`, validated, reviewed, and promoted to `data/questions/<exam-id>/questions.json`.

---

## 7. Sample Questions Interactive Experience

Sample Questions allows learners to study the question pool item-by-item with zero answer leaks on load.

### UI & Interaction Requirements

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [D1 Agentic Architecture]                                  [Basic Tier]│
│                                                                        │
│ Q14. An orchestrator subagent encounters a non-transient permission   │
│ error while running a step. What is the correct response?              │
│                                                                        │
│  ◯  A. Reassign the section to a successful subagent                   │
│  ◯  B. Let the failed subagent write its error into shared context    │
│  ◯  C. Surface the partial failure and request clarification          │
│  ◯  D. Grant the subagent broader permissions and rerun               │
│                                                                        │
│ [ Reveal answer ]                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

On clicking **Reveal answer**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [D1 Agentic Architecture]                                  [Basic Tier]│
│                                                                        │
│ Q14. An orchestrator subagent encounters a non-transient permission   │
│ error while running a step. What is the correct response?              │
│                                                                        │
│  ◯  A. Reassign the section to a successful subagent        [Incorrect]│
│  ◯  B. Let the failed subagent write its error to context   [Incorrect]│
│  ●  C. Surface partial failure & request clarification        [Correct]│
│  ◯  D. Grant the subagent broader permissions               [Incorrect]│
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Rationale & Explanation:                                           │ │
│ │ Option C is correct because permission errors are non-transient.   │ │
│ │ Widening permissions self-grants capability...                     │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ [ Unreveal answer ]                                                    │
└────────────────────────────────────────────────────────────────────────┘
```

### Choice Styling Rules (Accessible Color + Labels)
- **Initial State:** Neutral paper card background (`--card`), standard radio input (`A`, `B`, `C`, `D`), neutral text (`--fg`).
- **Revealed Correct Option:** Light green background (`--correct-bg`), dark green text (`--correct-fg`), green border, and bold `[Correct]` text badge.
- **Revealed Incorrect Options:** Light red background (`--wrong-bg`), dark red text (`--wrong-fg`), red border, and `[Incorrect]` text badge.
- **Unreveal:** Hides the rationale, resets colors to neutral, removes badges, and toggles button label back to `Reveal answer`.

### Handling Incomplete Questions (`ready` vs `review-only`)
- **`status: "ready"`:** Exactly 4 choices (A–D), 1 correct answer, reviewed, explanation present, no visible markers. Eligible for Mock Test pool.
- **`status: "review-only"`:** Questions with < 4 options, multi-select, or unverified keys. Rendered in Sample Questions with a `[Review-only item]` tag, but **strictly excluded** from the Mock Test pool.

---

## 8. Mock Test Engine & Session State

The Mock Test is a client-side single-page app embedded into Hugo layout `themes/retro-prep/layouts/mock-test/single.html` powered by `assets/js/mock-test.js`.

### Test Specifications

- **Total Questions:** 60 unique questions drawn from `mockEligible: true` pool.
- **Duration:** 120 minutes (7,200 seconds).
- **Domain Balancing:** Questions drawn according to exam weights:
  - D1 Agentic Architecture (27%) → **16 Questions**
  - D2 Tool Design & MCP (18%) → **11 Questions**
  - D3 Claude Code Workflows (20%) → **12 Questions**
  - D4 Prompt Engineering (20%) → **12 Questions**
  - D5 Context Management (15%) → **9 Questions**
- **Pre-start Verification:** If `questions.json` has fewer than 60 eligible questions or cannot satisfy domain quotas, the test refuses to start and displays an informative local message.

### Session & Timer Mechanics

```text
┌────────────────────────────────────────────────────────────────────────┐
│ CCAF MOCK TEST                                 ⏱ TIME LEFT: 01:58:32 │
├────────────────────────────────────────────────────────────────────────┤
│ Question 14 of 60  ·  Domain 1: Agentic Architecture & Orchestration    │
│                                                                        │
│ [Question Text]                                                        │
│ (A) ...  (B) ...  (C) ...  (D) ...                                     │
│                                                                        │
│ [ ◄ Previous ]  [ Next ► ]                  Progress: [████░░░░] 14/60 │
│                                                                        │
│                                                          [ End Exam ]  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Deadline Calculation:** Timer derives remaining time from `deadlineTimestamp = Date.now() + 120*60*1000`. Handles tab backgrounding, pauses, and window resizes without timer drift.
- **State Persistence:** Session stored in `sessionStorage` under key `ccaf_mock_attempt_v1`:
  ```json
  {
    "attemptId": "uuid-v4",
    "examId": "cca-f",
    "poolVersion": "sha256-hash",
    "startedAt": 1774000000000,
    "deadlineTimestamp": 1774007200000,
    "questionIds": ["q012", "q088", "..."],
    "answers": { "q012": "C", "q088": "A" },
    "submitted": false
  }
  ```
- **Auto-Submission:** Triggers automatically when `deadlineTimestamp` is reached.
- **Manual End Exam:** Displays modal confirmation ("Are you sure you want to submit 48/60 answered questions?").
- **Score Report Screen:**
  - Overall Score: `X / 60` (`YY%`).
  - Practice Pass / Fail Result (Pass threshold: 72% / 720 scaled).
  - Domain Breakdown Table: Domain name, answered, correct, percentage score.
  - Question Review List: links back to Sample Questions explanation for incorrect items.
  - Buttons: `Retake Mock Test` (generates new random attempt) and `Share Result` (copies privacy-safe text summary to clipboard).

---

## 9. Top Navigation & Retro Design System

### Top Bar Architecture
- **Left:** Text/SVG Logo `AI CERT // PREP` linking to `/`.
- **Center:** Dropdown Menu `Exams ▾` (opens native `<details>` card listing CCAF, CCAR-P, etc.).
- **Right:** Quick links to `Sample Questions`, `Mock Test`, and Theme Toggle `[ ☀ Light / ☾ Dark ]`.

### Retro Visual Tokens (`themes/retro-prep/assets/css/theme.css`)

```css
:root {
  /* Retro Light (Warm Paper & Ink) */
  --bg: #f9f6ee;
  --fg: #1a1714;
  --muted: #6b635b;
  --card: #ffffff;
  --border: #2a241f;
  --code-bg: #efebe0;
  --accent: #8c3016;       /* Terracotta / Amber Ink */
  --accent-hover: #6a230f;
  --focus-ring: #d97706;

  /* Feedback Colors */
  --correct-bg: #e6f4ea;
  --correct-fg: #137333;
  --correct-border: #1e8e3e;
  --wrong-bg: #fce8e6;
  --wrong-fg: #c5221f;
  --wrong-border: #d93025;

  --font-heading: "IBM Plex Mono", "Courier New", Courier, monospace;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
  --max-width: 960px;
}

[data-theme="dark"] {
  /* Retro Dark (Warm Slate & Aged Gold) */
  --bg: #141210;
  --fg: #eae4d9;
  --muted: #9e9484;
  --card: #1c1a17;
  --border: #4a4237;
  --code-bg: #24211d;
  --accent: #d97706;       /* Warm Gold */
  --accent-hover: #f59e0b;
  --focus-ring: #fbbf24;

  --correct-bg: #0c2e17;
  --correct-fg: #81c995;
  --correct-border: #34a853;
  --wrong-bg: #3c1412;
  --wrong-fg: #f28b82;
  --wrong-border: #ea4335;
}
```

---

## 10. Repository Automation Agent (`.agent/cert-prep-curator/`)

One bounded CLI agent handles preflight, source syncing, change detection, material extraction, candidate question building, and validation.

### CLI Command Matrix

```bash
# Step 1: Run safety preflight checks
node .agent/cert-prep-curator/cli.mjs preflight

# Step 2: Sync registered sources for an exam
node .agent/cert-prep-curator/cli.mjs sync --exam cca-f

# Step 3: Detect changes & generate hash report
node .agent/cert-prep-curator/cli.mjs detect-changes --exam cca-f

# Step 4: Extract materials (guides, notes, pdfs, articles)
node .agent/cert-prep-curator/cli.mjs extract --exam cca-f

# Step 5: Build question candidate JSON
node .agent/cert-prep-curator/cli.mjs build-questions --exam cca-f

# Step 6: Validate normalized question schema & answer keys
node .agent/cert-prep-curator/cli.mjs validate --exam cca-f

# Step 7: Stage validated assets into .data/
node .agent/cert-prep-curator/cli.mjs stage --exam cca-f

# Step 8: Promote approved staged items into content/ and data/
node .agent/cert-prep-curator/cli.mjs publish --exam cca-f --approved
```

---

## 11. Cloudflare Automation Architecture (Phase 8 Post-Sync)

Implemented only **after** the core site is deployed and passing on GitHub Pages.

```text
Cloudflare Cron Trigger (Weekly / On-demand)
                 ↓
Cloudflare Worker (`cloudflare/cert-prep-curator-worker/`)
                 ↓
1. Fetch registered HTTPS sources
2. Save raw snapshots to Cloudflare R2
3. Update manifests and hashes in Cloudflare D1
4. Detect changed/new sources
5. Parse material candidates & question candidates
6. Run `validate-questions.mjs` logic
7. Open a Pull Request on GitHub via GitHub API
                 ↓
Human Review & Merge PR on GitHub
                 ↓
GitHub Actions builds Hugo & deploys to GitHub Pages
```

### Cloudflare Limits & Free-Tier Budget
- **Worker Requests:** 100,000 / day
- **Worker CPU Time:** 10 ms / invocation
- **Cron Wall Clock Time:** 15 minutes max
- **R2 Storage:** 10 GB-month free (zero egress fee)
- **D1 Storage:** 5M reads / 100k writes per day
- **Workers AI:** 10,000 Neurons / day free
- **Safety Boundary:** The Worker creates PRs; it **never** pushes directly to `main` and **never** writes directly to the live GitHub Pages site.

---

## 12. Phased Migration & Implementation Roadmap

```text
Phase 0: Baseline & Freeze
  ├── Inventory current 106 content files, 26 docs, 8 PDFs, 1295 questions
  ├── Capture SHA-256 hash list of all files
  └── Confirm baseline `hugo` build passes

Phase 1: Repository Structure Cleanup
  ├── Create content/exams/cca-f/ hierarchy
  ├── Move PDFs to static/assets/cca-f/pdfs/
  ├── Create .agent/cert-prep-curator/ & .data/exams/cca-f/
  ├── Add ignore rules for public/, hugo.log, .DS_Store
  └── Verify parity before removing duplicate raw directories

Phase 2: Question Data Normalization
  ├── Parse 1,295 raw questions from all 6 sources into normalized JSON
  ├── Classify questions into `ready` (4 options A-D) vs `review-only`
  ├── Strip answer markers (✔, ✅, Correct: A) from initial displays
  ├── Validate questions with `scripts/validate-questions.mjs`
  └── Write data/questions/cca-f/questions.json

Phase 3: Multi-Exam Registry & Navigation
  ├── Write data/exams.toml
  ├── Create Home page (_index.md) all-exams listing
  ├── Create CCAF landing page
  └── Add Hugo aliases for legacy routes (/practice/, /study/, etc.)

Phase 4: Theme Consolidation (themes/retro-prep/)
  ├── Create themes/retro-prep/ layout tree
  ├── Add themes/retro-prep/assets/css/theme.css (tokens, light/dark)
  ├── Remove duplicate root CSS & themes/ccaf-theme/
  └── Implement accessible sticky top bar & dropdowns

Phase 5: Sample Questions Implementation
  ├── Implement themes/retro-prep/layouts/sample-questions/list.html
  ├── Implement assets/js/question-reveal.js
  └── Verify Reveal / Unreveal, green/red states, and radio controls

Phase 6: Mock Test Engine Implementation
  ├── Implement themes/retro-prep/layouts/mock-test/single.html
  ├── Implement assets/js/mock-test.js (timer, 60Q pool, domain quotas)
  └── Verify 120m timer, deadline calculation, sessionStorage, score report

Phase 7: Quality Verification & GitHub Sync
  ├── Run internal-link and external-link build validation
  ├── Confirm zero external links/assets in public/
  ├── Sync cleaned repository to GitHub main branch
  └── Confirm GitHub Actions deploys site to GitHub Pages

Phase 8: Cloudflare Automation Setup (Post-Sync)
  ├── Deploy cloudflare/cert-prep-curator-worker/
  ├── Bind R2 bucket & D1 database
  ├── Configure GitHub API token secret
  └── Test dry-run source fetch and PR generation workflow
```

---

## 13. Comprehensive Verification Checklist

### Repository Cleanup & Structure
- [ ] Only one active theme folder exists (`themes/retro-prep/`).
- [ ] No duplicate root CSS or legacy Jekyll files (`_includes/`, `_site/`) remain.
- [ ] `public/`, `hugo.log`, `.hugo_build.lock`, `.DS_Store` are untracked and ignored.
- [ ] `plan/sources.md` and `.data/` are excluded from published Hugo output.

### Question Quality & Interactive Controls
- [ ] Every `ready` question has exactly four options (A, B, C, D).
- [ ] No question renders with a preselected option or visible answer key on load.
- [ ] `Reveal answer` highlights correct option in green with `[Correct]` badge.
- [ ] `Reveal answer` highlights incorrect options in red with `[Incorrect]` badge.
- [ ] Explanation/rationale renders only after reveal.
- [ ] `Unreveal answer` restores neutral option styling and hides rationale.
- [ ] `review-only` questions are rendered in Sample Questions but excluded from Mock Test.

### Mock Test Engine
- [ ] Selects exactly 60 unique `mockEligible: true` questions.
- [ ] Enforces domain quotas (D1:16, D2:11, D3:12, D4:12, D5:9).
- [ ] Refuses to start if pool < 60 questions or domain quotas unsatisfied.
- [ ] Timer counts down from 120:00 using a fixed deadline timestamp.
- [ ] Session state persists in `sessionStorage` across page refreshes.
- [ ] Auto-submits on timer expiry; prompts confirmation on manual `End exam`.
- [ ] Score report displays score, percentage, practice pass/fail estimate, and domain breakdown.

### Link & Asset Policy (Zero Leaks)
- [ ] Zero external `href` links in rendered HTML.
- [ ] Zero external images, fonts, icons, or CDN scripts loaded.
- [ ] Zero external repository links in header/footer.
- [ ] Automated scanner `scripts/check-external-links.mjs` passes cleanly.

### Cloudflare Integration (Phase 8)
- [ ] Worker runs in dry-run mode before live cron enablement.
- [ ] R2 stores raw source snapshots; D1 stores manifests and content hashes.
- [ ] Worker creates GitHub Pull Requests; never pushes directly to `main`.
- [ ] GitHub Pages website remains 100% operational if Cloudflare Worker is offline.

---

## 14. Acceptance Criteria

The project is fully complete and accepted when:

1. **GitHub Pages Deployment:** Site is served statically via GitHub Pages from Hugo output with zero server requirements.
2. **Multi-Exam Readiness:** `data/exams.toml` defines `cca-f` with room for future exams without template changes.
3. **Sample Questions Working:** Every practice question starts neutral, supports 4 choices, displays green/red feedback on reveal, and hides feedback on unreveal.
4. **Mock Test Working:** 60-question, 120-minute timed exam runs client-side with domain quotas, session recovery, auto-submit, and score reporting.
5. **Clean Repository:** Unused theme files, duplicate CSS, build logs, and untracked `public/` files are removed.
6. **Zero Link Leaks:** Published HTML contains no external URLs, CDNs, or external assets.
7. **Curator Automation Ready:** `.agent/cert-prep-curator/` CLI commands pass preflight, validation, and staging checks.
8. **Cloudflare Automation Documented:** Cloudflare Workers adapter strategy is specified for Phase 8 post-sync activation.

---

This document represents the complete, unified, master plan for the repository.
